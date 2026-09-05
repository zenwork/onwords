const sourceDirectories = ['_data', '_includes', 'posts', 'static']
const sourceFiles = ['index.md', 'services.md', 'about.md', 'blog.page.vto']

async function copyDirectory(source: string, destination: string): Promise<void> {
  await Deno.mkdir(destination, { recursive: true })

  for await (const entry of Deno.readDir(source)) {
    if (entry.name === '.DS_Store') continue

    const from = `${source}/${entry.name}`
    const to = `${destination}/${entry.name}`
    if (entry.isDirectory) await copyDirectory(from, to)
    else if (entry.isFile) await Deno.copyFile(from, to)
  }
}

/**
 * Create an editable source copy for local CMS previews. Lume watches this
 * directory, not the working tree, so all CMS writes stay disposable.
 */
export async function createLocalCmsPreview(root = Deno.cwd()): Promise<string> {
  const previewRoot = await Deno.makeTempDir({ prefix: 'onwords-cms-' })

  for (const directory of sourceDirectories) {
    try {
      await copyDirectory(`${root}/${directory}`, `${previewRoot}/${directory}`)
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error
    }
  }

  for (const file of sourceFiles) {
    try {
      await Deno.copyFile(`${root}/${file}`, `${previewRoot}/${file}`)
    } catch (error) {
      if (!(error instanceof Deno.errors.NotFound)) throw error
    }
  }

  return previewRoot
}
