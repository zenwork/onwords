export async function setup() {
    console.log('setting up')
    const index = await Deno.readTextFile('./static/index.html')
    const env = Deno.env.toObject().ENVIRONMENT

    if (env === 'PROD') {
        index.replace('<meta name="robots" content="noindex, nofollow">', '<meta name="robots" content="index, follow">')
        await Deno.writeTextFile('./static/index.html', index)
        console.log('index updated for prod', `[${env}]`)
    } else {
        console.log('index not updated', `[${env}]`)
    }
}
