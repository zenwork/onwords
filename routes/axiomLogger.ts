import userAgent from 'user-agent'

let AXIOM_DATASET: string
let AXIOM_KEY: string
let AXIOM_TEST_KEY: string
let PROD_HOST_MATCH: string
let isProd: RegExp
;(function init() {
  const env = Deno.env.toObject()
  AXIOM_DATASET = env.AXIOM_DATASET ?? 'onwords'
  AXIOM_KEY = env.AXIOM_KEY ?? 'no-key-provided'
  AXIOM_TEST_KEY = env.AXIOM_TEST_KEY ?? 'no-test-key-provided'
  PROD_HOST_MATCH = env.PROD_HOST_MATCH ?? 'unknown'
  const regex = `https://(www.)?${PROD_HOST_MATCH}`
  isProd = new RegExp(regex)

  console.log(`ENVIRONMENT`)
  console.log(`-----------`)
  console.log(`AXIOM_DATASET  : ${AXIOM_DATASET}`)
  console.log(`AXIOM_KEY      : is set = ${AXIOM_KEY !== 'no-key-provided'}`)
  console.log(
    `AXIOM_TEST_KEY : is set = ${AXIOM_TEST_KEY !== 'no-test-key-provided'}`,
  )
  console.log(`PROD_HOST_MATCH: ${PROD_HOST_MATCH} (regex: ${regex})`)
})()

export function logUser(req: Request) {
  try {
    const {region, deployment, agent} = getContext(req)
    const {browser, cpu, device, engine, os} = userAgent(agent)
    const lang = req.headers.get('accept-language')
    const referer = req.headers.get('referer')

    const data = {
      name: 'user',
      host: req.url,
      region,
      deployment,
      agent: {raw: agent, browser, cpu, device, engine, os},
      lang,
      referer,
    }

    ingest(data, req.url)
  } catch (e) {
    console.log(e)
  }
}

function ingest(data: any, caller: string) {
  const host = caller
  if (!isProd.test(host)) {
    console.log(data)
  }

  const {ingestionUrl, key} = getIngestor(host)
  fetchAndForget(ingestionUrl, key, data)
}

function getIngestor(url: string) {
  let target = AXIOM_DATASET
  let key = AXIOM_KEY
  if (!isProd.test(url)) {
    target = target + '-test'
    key = AXIOM_TEST_KEY
  }
  return {
    ingestionUrl: `https://api.axiom.co/v1/datasets/${target}/ingest`,
    key,
  }
}

function getContext(req: Request) {
  const region = Deno.env.get('DENO_REGION') ?? 'unknown'
  const deployment = Deno.env.get('DENO_DEPLOYMENT_ID') ?? 'unknown'
  const agent = req.headers.get('User-Agent') ?? 'unknown'
  return {region, deployment, agent}
}

function fetchAndForget(
  axiomUrl,
  key: string,
  data: { agent: any; host: any; region: string; deployment: string },
) {
  fetch(
    axiomUrl,
    {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([
        {
          '_time': new Date().toISOString(),
          data,
        },
      ]),
    },
  )
}
