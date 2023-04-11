import {Handlers}       from '$fresh/server.ts'
import {SitemapContext} from 'https://deno.land/x/fresh_seo@0.2.1/mod.ts'
import manifest         from '../fresh.gen.ts'

export const handler: Handlers = {
  GET() {
    const sitemap = new SitemapContext('https://onwords.ch', manifest)
    // You can add additional page here
    return sitemap.render()
  },
}
