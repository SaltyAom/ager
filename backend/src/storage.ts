import { createClient } from '@supabase/supabase-js'

const {
    SUPABASE_URL: url,
    SUPABASE_CLIENT: key,
    SUPABASE_SERVICE_ROLE: secret
} = process.env
if (!url) throw new Error('SUPABASE_URL env is missing')
if (!key) throw new Error('SUPABASE_CLIENT env is missing')
if (!secret) throw new Error('SUPABASE_SERVICE_ROLE env is missing')

export const client = createClient(url, secret, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

export const upload = async (name: string, blob: Blob) => {
    const { data, error } = await client.storage.from('ager').upload(name, blob)

    if (error) throw error
    if (!data) throw new Error("Data shouldn't be null")

    return `${url}/storage/v1/object/public/ager/${data.path}`
}

export const appendResult = async (id: number) => {
    const { data, error } = await client.from('ager').insert({
        id
    })

    if (error) throw error
}

// import { Storage } from '@google-cloud/storage'

// const storage = new Storage()
// const bucket = storage.bucket('ager')

// export const upload = async (
//     blob: Blob,
//     name = `${Date.now()}.jpg`
// ) => {
//     const file = bucket.file(name)

//     // @ts-ignore
//     await file.save(Buffer.from(await blob.arrayBuffer()))
//     await file.makePublic()

//     return `https://storage.googleapis.com/ager/${name}`
// }
