function assertIncludes(value: string, expected: string, description: string) {
  if (!value.includes(expected)) throw new Error(`${description}: expected ${expected}`)
}

Deno.test('Lume build emits public pages and discovery metadata', async () => {
  const build = await new Deno.Command(Deno.execPath(), {
    args: ['task', 'build'],
    cwd: Deno.cwd(),
    stdout: 'piped',
    stderr: 'piped',
  }).output()
  if (!build.success) throw new Error(new TextDecoder().decode(build.stderr))

  const paths = [
    '_site/index.html',
    '_site/services/index.html',
    '_site/about/index.html',
    '_site/blog/index.html',
    '_site/feed.xml',
    '_site/sitemap.xml',
    '_site/robots.txt',
  ]
  for (const path of paths) await Deno.stat(path)

  const home = await Deno.readTextFile('_site/index.html')
  const sitemap = await Deno.readTextFile('_site/sitemap.xml')
  const feed = await Deno.readTextFile('_site/feed.xml')
  assertIncludes(home, '<link rel="canonical" href="https://onwords.ch/">', 'home canonical URL')
  assertIncludes(home, 'property="og:image"', 'home Open Graph image')
  assertIncludes(sitemap, 'https://onwords.ch/blog/', 'blog sitemap entry')
  assertIncludes(feed, 'On Words journal', 'RSS channel title')
})
