import lume from 'lume/mod.ts'
import feed from 'lume/plugins/feed.ts'
import sitemap from 'lume/plugins/sitemap.ts'
import { relative } from 'jsr:@std/path@1.1.4'

const localRoot = Deno.env.get('CMS_LOCAL_ROOT')
const source = localRoot ? relative(Deno.cwd(), localRoot) : '.'
const site = lume({
  src: source,
  dest: './_site',
  location: new URL('https://onwords.ch'),
})

site.ignore('.github', '.git', '.agents', '.codex', 'tests', 'lib', 'AGENTS.md', 'README.md', 'LICENSE', 'plan.md', 'deno.json', 'deno.lock')
site.copy('static', '.')
site.use(sitemap())
site.use(feed({
  output: '/feed.xml',
  query: 'type=post',
  info: {
    title: 'On Words journal',
    description: 'Notes from On Words, English editing and proofreading in Switzerland.',
  },
}))

// The CMS's local-only mode writes to a temporary source tree. Lume's
// incremental watcher can notify the browser before rebuilding pages sourced
// from that external directory. Build the whole preview on each CMS save, then
// notify the reload middleware about the freshly generated output.
if (localRoot) {
  let rebuild = Promise.resolve()

  site.addEventListener('beforeUpdate', (event) => {
    // Let Lume cancel and finish its current incremental update before calling
    // build(): `build()` cannot run while its internal timing measurement is
    // still open.
    setTimeout(() => {
      rebuild = rebuild.then(async () => {
        await site.build()
        await site.dispatchEvent({
          type: 'afterUpdate',
          files: event.files,
          pages: site.pages,
          staticFiles: site.files,
        })
      }).catch((error) => {
        console.error('Unable to rebuild the local CMS preview:', error)
      })
    }, 0)

    return false
  })
}

export default site
