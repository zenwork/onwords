export interface PullRequest {
  number: number
  html_url: string
  state: 'open' | 'closed'
  merged_at: string | null
}

export interface DraftGitHubOptions {
  branch?: string
  base?: string
  fetch?: typeof fetch
}

type GitHubFile = { content: string; sha: string }
type GitHubRef = { object: { sha: string } }

/**
 * GitHub-backed LumeCMS storage that keeps edits on one reviewable branch.
 * Every write creates or updates the cms/draft → main pull request. A merged
 * pull request resets the draft branch to main before the next edit cycle.
 */
export class DraftGitHubStorage implements Storage {
  readonly branch: string
  readonly base: string
  readonly #root: string
  readonly #repository: string
  readonly #fetch: typeof fetch

  static create(repository: string, token: string, options: DraftGitHubOptions = {}) {
    return new DraftGitHubStorage(repository, token, options)
  }

  constructor(repository: string, token: string, options: DraftGitHubOptions = {}, root = '') {
    if (!/^[^/]+\/[^/]+$/.test(repository)) throw new Error('GITHUB_REPOSITORY must be owner/repository')
    this.#repository = repository
    this.branch = options.branch ?? 'cms/draft'
    this.base = options.base ?? 'main'
    this.#root = root.replace(/^\/+|\/+$/g, '')
    this.#fetch = options.fetch ?? ((input, init) =>
      fetch(input, {
        ...init,
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${token}`,
          'X-GitHub-Api-Version': '2022-11-28',
          ...init?.headers,
        },
      }))
  }

  async *[Symbol.asyncIterator](): AsyncGenerator<EntrySource> {
    const tree = await this.#request<{ tree: Array<{ path: string; type: string }> }>(
      `/git/trees/${encodeURIComponent(this.branch)}?recursive=1`,
    )
    const prefix = this.#root ? `${this.#root}/` : ''
    for (const item of tree.tree) {
      if (item.type !== 'blob' || !item.path.startsWith(prefix)) continue
      const path = item.path.slice(prefix.length)
      if (path.split('/').some((part) => part.startsWith('.'))) continue
      yield this.source(path)
    }
  }

  name(name?: string): string {
    return (name ?? crypto.randomUUID()).toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-|-$|\.{2,}/g, '')
  }

  source(name: string): EntrySource {
    const path = this.#fullPath(name)
    return {
      name,
      path: `/${path}`,
      src: `https://github.com/${this.#repository}/blob/${this.branch}/${path}`,
    }
  }

  directory(name: string): Storage {
    return new DraftGitHubStorage(this.#repository, '', {
      branch: this.branch,
      base: this.base,
      fetch: this.#fetch,
    }, this.#fullPath(name))
  }

  get(name: string): Entry {
    return new DraftGitHubEntry(this.source(name), this)
  }

  async read(path: string): Promise<Uint8Array | undefined> {
    const response = await this.#request<GitHubFile>(
      `/contents/${this.#path(this.#fullPath(path))}?ref=${encodeURIComponent(this.branch)}`,
      undefined,
      true,
    )
    if (!response) return undefined
    return Uint8Array.from(atob(response.content.replace(/\n/g, '')), (character) => character.charCodeAt(0))
  }

  async write(path: string, content: Uint8Array | string): Promise<void> {
    await this.#prepareDraft()
    const fullPath = this.#fullPath(path)
    const existing = await this.#request<GitHubFile>(
      `/contents/${this.#path(fullPath)}?ref=${encodeURIComponent(this.branch)}`,
      undefined,
      true,
    )
    const bytes = typeof content === 'string' ? new TextEncoder().encode(content) : content
    await this.#request(`/contents/${this.#path(fullPath)}`, {
      method: 'PUT',
      body: JSON.stringify({
        message: `cms: update ${path}`,
        content: this.#base64(bytes),
        branch: this.branch,
        ...(existing ? { sha: existing.sha } : {}),
      }),
    })
    await this.ensurePullRequest()
  }

  async delete(path: string): Promise<void> {
    await this.#prepareDraft()
    const fullPath = this.#fullPath(path)
    const existing = await this.#request<GitHubFile>(`/contents/${this.#path(fullPath)}?ref=${encodeURIComponent(this.branch)}`)
    await this.#request(`/contents/${this.#path(fullPath)}`, {
      method: 'DELETE',
      body: JSON.stringify({ message: `cms: remove ${path}`, sha: existing.sha, branch: this.branch }),
    })
    await this.ensurePullRequest()
  }

  async rename(name: string, newName: string): Promise<void> {
    const content = await this.read(name)
    if (!content) throw new Error(`Cannot rename missing CMS file: ${name}`)
    await this.write(newName, content)
    await this.delete(name)
  }

  async ensurePullRequest(): Promise<PullRequest> {
    const pullRequests = await this.#request<PullRequest[]>(
      `/pulls?state=open&head=${encodeURIComponent(`${this.#owner}:${this.branch}`)}&base=${encodeURIComponent(this.base)}`,
    )
    if (pullRequests[0]) return pullRequests[0]
    return await this.#request<PullRequest>('/pulls', {
      method: 'POST',
      body: JSON.stringify({
        title: 'Editorial updates',
        head: this.branch,
        base: this.base,
        body: 'Changes made in LumeCMS. Review the Deno Deploy preview before merging.',
      }),
    })
  }

  async resetAfterMerge(): Promise<boolean> {
    const openPullRequests = await this.#request<PullRequest[]>(
      `/pulls?state=open&head=${encodeURIComponent(`${this.#owner}:${this.branch}`)}&base=${encodeURIComponent(this.base)}`,
    )
    if (openPullRequests.length) return false
    const pullRequests = await this.#request<PullRequest[]>(
      `/pulls?state=closed&head=${encodeURIComponent(`${this.#owner}:${this.branch}`)}&base=${encodeURIComponent(this.base)}`,
    )
    if (!pullRequests.some((pullRequest) => pullRequest.merged_at)) return false
    const main = await this.#ref(this.base)
    await this.#request(`/git/refs/heads/${this.#refName(this.branch)}`, {
      method: 'PATCH',
      body: JSON.stringify({ sha: main, force: true }),
    })
    return true
  }

  async #prepareDraft(): Promise<void> {
    await this.#ensureBranch()
    await this.resetAfterMerge()
  }

  async #ensureBranch(): Promise<void> {
    const draft = await this.#request<GitHubRef>(`/git/ref/heads/${this.#refName(this.branch)}`, undefined, true)
    if (draft) return
    await this.#request('/git/refs', {
      method: 'POST',
      body: JSON.stringify({ ref: `refs/heads/${this.branch}`, sha: await this.#ref(this.base) }),
    })
  }

  async #ref(branch: string): Promise<string> {
    return (await this.#request<GitHubRef>(`/git/ref/heads/${this.#refName(branch)}`)).object.sha
  }

  async #request<T = unknown>(path: string, init?: RequestInit): Promise<T>
  async #request<T = unknown>(path: string, init: RequestInit | undefined, allow404: true): Promise<T | undefined>
  async #request<T = unknown>(path: string, init?: RequestInit, allow404 = false): Promise<T | undefined> {
    const response = await this.#fetch(`https://api.github.com/repos/${this.#repository}${path}`, init)
    if (allow404 && response.status === 404) return undefined
    if (!response.ok) throw new Error(`GitHub ${init?.method ?? 'GET'} ${path} failed: ${response.status} ${await response.text()}`)
    return await response.json() as T
  }

  get #owner(): string {
    return this.#repository.split('/')[0]
  }

  #path(path: string): string {
    return path.split('/').map(encodeURIComponent).join('/')
  }

  #refName(branch: string): string {
    return branch.split('/').map(encodeURIComponent).join('/')
  }

  #base64(bytes: Uint8Array): string {
    let text = ''
    for (const byte of bytes) text += String.fromCharCode(byte)
    return btoa(text)
  }

  #fullPath(path: string): string {
    return [this.#root, path.replace(/^\/+/, '')].filter(Boolean).join('/')
  }
}

class DraftGitHubEntry implements Entry {
  constructor(readonly source: EntrySource, readonly storage: DraftGitHubStorage) {}

  async readText(): Promise<string> {
    const content = await this.storage.read(this.source.name)
    if (!content) throw new Error(`CMS file not found: ${this.source.path}`)
    return new TextDecoder().decode(content)
  }

  async writeText(content: string): Promise<void> {
    await this.storage.write(this.source.name, content)
  }

  async readData(): Promise<Data> {
    return await fromFilename(this.source.name).toData(await this.readText())
  }

  async writeData(data: Data): Promise<void> {
    await this.writeText((await fromFilename(this.source.name).fromData(data)).replaceAll(/\r\n/g, '\n'))
  }

  async readFile(): Promise<File> {
    const content = await this.storage.read(this.source.name)
    if (!content) throw new Error(`CMS file not found: ${this.source.path}`)
    return new File([new Uint8Array(content).buffer], this.source.name)
  }

  async writeFile(file: File): Promise<void> {
    await this.storage.write(this.source.name, new Uint8Array(await file.arrayBuffer()))
  }
}
import { fromFilename } from 'lume/cms/storage/transformers/mod.ts'
import type { Data, Entry, EntrySource, Storage } from 'lume/cms/types.ts'
