// import '@bogeychan/elysia-polyfills/node/index.js'
// import 'dotenv/config'

import { Elysia, t } from 'elysia'

import { generateImage } from './replicate'
import { upload, appendResult } from './storage'
import { cors } from '@elysiajs/cors'

const app = new Elysia()
    .use(cors())
    .get('/', () => 'Ager')
    .put(
        '/',
        async ({ body: { image } }) => {
            const id = Date.now()
            const generated = await generateImage(
                await upload(`input/${id}.jpg`, image)
            )

            const processed = await upload(
                `processed/${id}.gif`,
                await fetch(generated).then((x) => x.blob())
            )

            await appendResult(id)

            return processed
        },
        {
            body: t.Object({
                image: t.File({
                    type: ['image/jpeg', 'image/png']
                })
            })
        }
    )
    .listen({
        port: 8080,
        hostname: '0.0.0.0'
    })

export type App = typeof app

console.log(
    `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
)
