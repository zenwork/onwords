# On Words

The static site for Allison Turner’s English editing and proofreading service.
It is built with [Lume](https://lume.land/) and its editorial content is managed
with LumeCMS.

## Local development

```sh
deno task serve
```

This builds the site and serves `_site` locally. Run a one-off production build
with `deno task build`.

To test the CMS interface and live-preview temporary edits without GitHub
credentials, source-file changes, or commits, run:

```sh
deno task cms
```

This creates a temporary copy of the editable site, which Lume watches for
live page refreshes. The default local login is `admin` /
`local-development-only`; set `CMS_USERNAME` and `CMS_PASSWORD` to override
it. All local-only edits are discarded when the CMS server stops.

To run the CMS against a GitHub test repository instead, export the CMS and
GitHub values and run `deno task cms:github`. Saving then writes to `cms/draft`
and creates or updates its review pull request.

## Editorial workflow

The CMS runs as a separate Deno Deploy application at `admin.onwords.ch`. It
writes changes to `cms/draft` and creates or updates one pull request to `main`.
Deno Deploy’s GitHub preview for that pull request is the review environment;
merging it is the only production publishing action.

Set these Deno Deploy secrets on the CMS app only:

- `CMS_USERNAME` and `CMS_PASSWORD` for Basic Auth
- `GITHUB_TOKEN`, a fine-grained token limited to this repository’s Contents
  and Pull requests read/write permissions
- `GITHUB_REPOSITORY` in the form `owner/repository`

The public app is a GitHub-connected Deno Deploy static app: build command
`deno task build`, output directory `_site`, and production branch `main`.
Attach `onwords.ch` there and configure `www.onwords.ch` as a redirect. Attach
`admin.onwords.ch` to the separate CMS app whose entrypoint is `_cms.ts`.
