import {Application} from 'https://deno.land/x/oak/mod.ts'
import {brotli}      from 'https://deno.land/x/oak_compress/mod.ts'
import staticFiles   from 'https://deno.land/x/static_files/mod.ts'
import {setup}       from './setup.ts'

const app = new Application()
const oneHour = 3_600_000

await setup()

app.use(brotli())
app.use(staticFiles('./static', {
    cacheControl: true,
    maxAge: oneHour
}))

await app.listen({port: 8000})
