import {Hono}  from 'npm:hono'
import {serve} from '/std/http/server.ts'
import {call}  from './call.ts'

const app = new Hono()

app.get('/', call)

serve(app.fetch)
