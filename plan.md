# Migration plan: onwords.ch → new Deno Deploy

**Status:** Phases 1–3 done. New app is live and verified at
`https://onwords-1mn5ry41f310.zenwork.deno.net/`. Next up: phase 4 (domain cutover).

**Context:** This is a Fresh 1.7.3 app (`main.ts` → `fresh.gen.ts`), currently deployed as Deploy Classic project
`zenwork-onwords` via `.github/workflows/deploy.yml` using `denoland/deployctl@v1` + OIDC. Deploy Classic shuts down
**July 20, 2026**.

**Good news from checking the code:** Fresh switched to `Deno.serve()` internally back in v1.3, and this app is on
1.7.3 — so the "legacy `serve()` doesn't work on new Deploy" blocker doesn't apply here. No Deno KV, Deno Queues, or
`Deno.cron` usage either, so there's no data to migrate. This is a fairly clean lift.

**Things that do need attention:**
- Runtime env vars set in the Deploy Classic dashboard (not in repo): `AXIOM_DATASET`, `AXIOM_KEY`, `AXIOM_TEST_KEY`,
  `PROD_HOST_MATCH` — need to be recreated in the new dashboard.
- `lib/axiomLogger.ts` reads `DENO_REGION` for log metadata — new Deploy doesn't guarantee this var. Cosmetic only
  (logs would show `region: unknown`), not a functional break. Leave it and fix later rather than block on it.
- Custom domain `onwords.ch` (+ `www`) needs a DNS cutover.
- `deployctl` is being sunset — the new platform prefers either its GitHub App integration (no YAML) or the new
  `deno deploy` CLI subcommand.

## Phases

**1. Stand up the new org/app (console.deno.com — you) — done**
- Org created at console.deno.com, app `onwords` connected to the GitHub repo via the Deno Deploy GitHub App.
- Env vars added: `AXIOM_DATASET`, `AXIOM_KEY`, `AXIOM_TEST_KEY`, `PROD_HOST_MATCH` (new Axiom ingest tokens
  generated directly in Axiom, scoped to the `onwords`/`onwords-test` datasets, since Deploy Classic wasn't
  reachable to copy the old ones).

**2. First deploy + smoke test — done**
- Preview URL live and verified: `https://onwords-1mn5ry41f310.zenwork.deno.net/` returns 200, full page content
  renders correctly, `sitemap.xml` returns 200, response headers confirm it's serving from the new platform.

**3. Repo changes — done**
- Fixed stale `deno.lock` integrity hashes (esm.sh/jsdelivr "friendly" URLs turned out to be non-content-stable
  over time — see [denoland/deno#27837](https://github.com/denoland/deno/issues/27837)); migrated `import_map.json`
  to `npm:` specifiers for `preact`, `@preact/signals`, `@preact/signals-core`, and `ua-parser-js` (dropping the
  `deno.land/x/user_agent` wrapper) so builds resolve against immutable npm registry tarballs instead.
- Added `build`/`preview` tasks to `deno.json` — the new platform's Fresh preset runs `deno task build` by
  convention, which this repo never had (Deploy Classic ran `main.ts` directly with no build step). Added `_fresh/`
  to `.gitignore`.
- Fixed an unrelated bug found while verifying: `routes/index.tsx` set `Cache-Control: max-age` using a
  milliseconds value (`3_600_000`) instead of seconds, caching the home page for ~41 days instead of 1 hour.
- `.github/workflows/deploy.yml` (old `deployctl`-based CI) intentionally left in place for now — it deploys to
  Deploy Classic independently of the new GitHub App integration, so keeping it running is harmless and keeps
  Classic as a live fallback until the domain cutover is confirmed. Remove it in phase 5.

**4. Domain cutover — next**
- Add `onwords.ch` and `www.onwords.ch` as custom domains on the new app.
- Add the `_acme-challenge` CNAME it gives you, then repoint the domain's CNAME/A records to the new Deploy target.
- Wait for propagation (up to 48h), verify TLS + the live site, then remove the domain from the Deploy Classic
  project.

**5. Decommission old side — not started**
- Confirm Axiom is receiving prod events from the new deployment.
- Remove `.github/workflows/deploy.yml`.
- Delete/archive the Deploy Classic project `zenwork-onwords` (or leave it inert until closer to the July 20
  shutdown as a fallback).
