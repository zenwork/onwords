export async function setup() {
    console.log('setting up')
    const index = await Deno.readTextFile('./static/index.html')
    const env = Deno.env.toObject().ENVIRONMENT

    if (env === 'PROD') {
        // await Deno.writeTextFile('./static/index.html',
        //     index.replace('<meta content="noindex, nofollow" name="robots">', '<meta content="index, follow" name="robots">'))
        console.log('index updated for prod', `[${env}]`)
    } else {
        console.log('index not updated', `[${env}]`)
    }
}
