import lumeCMS from 'lume/cms/mod.ts'
import Fs from 'lume/cms/storage/fs.ts'
import { DraftGitHubStorage } from './lib/github_draft.ts'

const username = Deno.env.get('CMS_USERNAME')
const password = Deno.env.get('CMS_PASSWORD')
const repository = Deno.env.get('GITHUB_REPOSITORY')
const token = Deno.env.get('GITHUB_TOKEN')
const isDeploy = Boolean(Deno.env.get('DENO_DEPLOYMENT_ID'))
const localOnly = Deno.env.get('CMS_LOCAL_ONLY') === 'true'
const localRoot = Deno.env.get('CMS_LOCAL_ROOT')

if (isDeploy && (!username || !password || !repository || !token)) {
  throw new Error('CMS_USERNAME, CMS_PASSWORD, GITHUB_REPOSITORY, and GITHUB_TOKEN must be set on the CMS deployment')
}
if (isDeploy && localOnly) throw new Error('CMS_LOCAL_ONLY is only available outside Deno Deploy')
if (localOnly && !localRoot) throw new Error('CMS_LOCAL_ROOT must be set when CMS_LOCAL_ONLY is enabled')

const cms = lumeCMS({
  auth: {
    method: 'basic',
    users: { [username ?? 'admin']: password ?? 'local-development-only' },
  },
})

const storage = localOnly ? new Fs({ root: localRoot, path: '**' }) : DraftGitHubStorage.create(repository ?? 'local/onwords', token ?? '')
cms.storage('draft', storage)
cms.upload('images', 'draft:static/uploads')

cms.document('Site details', 'draft:_data/site.yml', [
  'title: text!',
  'description: textarea!',
  'email: email!',
  'author: text!',
])

cms.document('Homepage', 'draft:index.md', [
  'layout: hidden',
  'title: text!',
  'description: textarea!',
  'content: markdown!',
])

cms.document('Services', 'draft:services.md', [
  'layout: hidden',
  'title: text!',
  'description: textarea!',
  'content: markdown!',
])

cms.document('About', 'draft:about.md', [
  'layout: hidden',
  'title: text!',
  'description: textarea!',
  'content: markdown!',
])

cms.collection({
  name: 'posts',
  label: 'Journal posts',
  description: 'Drafts are saved to cms/draft and appear in the single review pull request.',
  store: 'draft:posts/*.md',
  documentName: '{title}.md',
  rename: false,
  transform(data, _content, isNew) {
    if (isNew) {
      data.layout = 'layouts/post.vto'
      data.type = 'post'
      data.url = `/blog/${String(data.title).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')}/`
    }
  },
  fields: [
    'layout: hidden',
    'type: hidden',
    'url: hidden',
    'title: text!',
    'date: date!',
    'description: textarea!',
    'tags: list',
    { name: 'image', type: 'file', upload: 'images:posts' },
    'content: markdown!',
  ],
})

export default cms
