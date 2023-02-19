import {Hono}  from 'npm:hono'
import {serve} from 'https://deno.land/std@0.177.0/http/server.ts'
import {call}  from './call.ts'

const app = new Hono()

app.get('/', call)

serve(app.fetch)
