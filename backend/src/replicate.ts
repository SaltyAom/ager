import Replicate from 'replicate'

const { REPLICATE_API_TOKEN } = process.env
if (!REPLICATE_API_TOKEN) throw new Error('REPLICATE_API_TOKEN env is missing')

const replicate = new Replicate({
    auth: REPLICATE_API_TOKEN
})

const model =
    'yuval-alaluf/sam:9222a21c181b707209ef12b5e0d7e94c994b58f01c7b2fec075d2e892362f13c'

export const generateImage = (image: string) =>
    replicate.run(model, {
        input: {
            image,
            target_age: 'default'
        }
    }) as Promise<any> as Promise<string>
