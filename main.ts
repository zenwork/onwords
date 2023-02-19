import { Application } from "https://deno.land/x/oak/mod.ts";
import {call}          from './call.ts'

const app = new Application();

app.use(call);

await app.listen({ port: 8000 });
