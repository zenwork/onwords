import { createLocalCmsPreview } from '../lib/local_cms_preview.ts'

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) throw new Error(message)
}

Deno.test('local CMS preview is a disposable copy of the source content', async () => {
  const original = await Deno.readTextFile('index.md')
  const previewRoot = await createLocalCmsPreview()

  try {
    const previewHomepage = `${previewRoot}/index.md`
    assert(await Deno.readTextFile(previewHomepage) === original, 'homepage was not copied into the preview')
    await Deno.writeTextFile(previewHomepage, 'temporary CMS preview edit')
    assert(await Deno.readTextFile('index.md') === original, 'preview edit changed the source file')
  } finally {
    await Deno.remove(previewRoot, { recursive: true })
  }
})
