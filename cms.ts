import { createLocalCmsPreview } from './lib/local_cms_preview.ts'

const previewRoot = await createLocalCmsPreview()
console.log(`Local CMS preview source: ${previewRoot}`)

const port = Deno.env.get('CMS_PORT')

const child = new Deno.Command(Deno.execPath(), {
  args: ['task', 'lume', '--serve', ...(port ? ['--port', port] : [])],
  cwd: Deno.cwd(),
  env: {
    ...Deno.env.toObject(),
    CMS_LOCAL_ONLY: 'true',
    CMS_LOCAL_ROOT: previewRoot,
  },
}).spawn()

let exitCode = 1
try {
  exitCode = (await child.status).code
} finally {
  await Deno.remove(previewRoot, { recursive: true })
}

Deno.exit(exitCode)
