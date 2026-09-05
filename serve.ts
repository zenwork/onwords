import site from './_config.ts'
import Server from 'lume/core/server.ts'

await site.build()

const port = Number(Deno.env.get('PORT') ?? 3000)
const server = new Server({ port, root: `${Deno.cwd()}/_site` })
server.addEventListener('start', () => console.log(`Listening on http://localhost:${port}`))
server.start()
