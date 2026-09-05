import { DraftGitHubStorage } from '../lib/github_draft.ts'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

Deno.test('CMS writes to cms/draft and opens one review pull request', async () => {
  const calls: Array<{ method: string; url: URL; body?: unknown }> = []
  const mockFetch: typeof fetch = (input, init = {}) => {
    const url = new URL(String(input))
    const method = init.method ?? 'GET'
    const body = init.body ? JSON.parse(String(init.body)) : undefined
    calls.push({ method, url, body })

    if (url.pathname.endsWith('/git/ref/heads/cms/draft')) return Promise.resolve(new Response('Not found', { status: 404 }))
    if (url.pathname.endsWith('/git/ref/heads/main')) return Promise.resolve(Response.json({ object: { sha: 'main-sha' } }))
    if (url.pathname.endsWith('/git/refs')) return Promise.resolve(Response.json({}))
    if (url.pathname.endsWith('/contents/posts/example.md')) {
      return Promise.resolve(method === 'GET' ? new Response('Not found', { status: 404 }) : Response.json({}))
    }
    if (url.pathname.endsWith('/pulls')) {
      return Promise.resolve(
        method === 'POST'
          ? Response.json({ number: 12, html_url: 'https://github.test/pr/12', state: 'open', merged_at: null })
          : Response.json([]),
      )
    }
    throw new Error(`Unexpected request: ${method} ${url}`)
  }

  const storage = DraftGitHubStorage.create('owner/onwords', 'test-token', { fetch: mockFetch })
  await storage.write('posts/example.md', '# Example')

  const branchCreate = calls.find((call) => call.method === 'POST' && call.url.pathname.endsWith('/git/refs'))
  assert(branchCreate?.body && (branchCreate.body as { ref: string }).ref === 'refs/heads/cms/draft', 'draft branch was not created')
  const fileWrite = calls.find((call) => call.method === 'PUT' && call.url.pathname.endsWith('/contents/posts/example.md'))
  assert(fileWrite?.body && (fileWrite.body as { branch: string }).branch === 'cms/draft', 'file was not written to the draft branch')
  const pullCreate = calls.find((call) => call.method === 'POST' && call.url.pathname.endsWith('/pulls'))
  assert(pullCreate?.body && (pullCreate.body as { base: string }).base === 'main', 'review pull request was not opened against main')
})

Deno.test('CMS resets the draft branch after its pull request merges', async () => {
  const calls: Array<{ method: string; url: URL; body?: unknown }> = []
  const mockFetch: typeof fetch = (input, init = {}) => {
    const url = new URL(String(input))
    const method = init.method ?? 'GET'
    const body = init.body ? JSON.parse(String(init.body)) : undefined
    calls.push({ method, url, body })
    if (url.pathname.endsWith('/pulls') && url.searchParams.get('state') === 'open') return Promise.resolve(Response.json([]))
    if (url.pathname.endsWith('/pulls') && url.searchParams.get('state') === 'closed') {
      return Promise.resolve(
        Response.json([{ number: 12, html_url: 'https://github.test/pr/12', state: 'closed', merged_at: '2026-07-18T12:00:00Z' }]),
      )
    }
    if (url.pathname.endsWith('/git/ref/heads/main')) return Promise.resolve(Response.json({ object: { sha: 'new-main-sha' } }))
    if (url.pathname.endsWith('/git/refs/heads/cms/draft') && method === 'PATCH') return Promise.resolve(Response.json({}))
    throw new Error(`Unexpected request: ${method} ${url}`)
  }

  const storage = DraftGitHubStorage.create('owner/onwords', 'test-token', { fetch: mockFetch })
  assert(await storage.resetAfterMerge(), 'merged pull request was not detected')
  const reset = calls.find((call) => call.method === 'PATCH')
  assert(reset?.body && (reset.body as { sha: string; force: boolean }).sha === 'new-main-sha', 'draft branch was not reset to main')
  assert((reset.body as { force: boolean }).force, 'draft branch reset must be forced')
})
