<script lang="ts">
  import { api } from '$lib'
  import UploadIcon from '../components/icons/upload-icon.svelte'
  import Hourglass from '../components/hourglass.svelte'
  import QRCode from 'qrcode'

  let image: FileList | undefined
  let isLoading = false
  let result: string | undefined
  let previewImg: HTMLImageElement
  let qrImgSrc: string

  const generateQR = async (text: string) => {
    try {
      return QRCode.toDataURL(text)
    } catch (err) {
      return ''
      console.error(err)
    }
  }

  const process = async () => {
    if (isLoading) return
    isLoading = true

    if (!image) return

    const preview = image[0]
    if (preview) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        previewImg.setAttribute('src', reader.result || '')
      })
      reader.readAsDataURL(preview)
    }

    result = undefined
    const { data, error } = await api.index.put({
      image
    })

    isLoading = false
    if (error) return

    result = data
    qrImgSrc = await generateQR(result || '')
  }
</script>

<main
  class="flex flex-col justify-center items-center w-full min-h-screen bg-gradient-to-b from-white to-gray-50"
>
  {#if result}
    <article class="flex flex-col max-w-xl justify-center items-center gap-6 p-6">
      <figure class="m-0 bg-gray-800 rounded-2xl overflow-hidden">
        <img src={result} alt="Result" class="object-cover object-center aspect-square shadow-md" />
      </figure>
      <img src={qrImgSrc} id="qr" alt="qr" class="aspect-square w-20 bg-gray-200 rounded-md" />
    </article>
    <button
      class="absolute bottom-0 m-8 px-4 py-2 rounded-full bg-gray-700 text-gray-100 flex justify-center items-center gap-2"
      on:click={() => {
        result = ''
        isLoading = false
      }}><UploadIcon class="w-5 h-5" fill="#fff" stroke-width={0.5} /> Get another image</button
    >
  {:else}
    <form class="flex flex-col gap-4" on:submit|preventDefault={process}>
      <section
        class="relative flex flex-col text-gray-600 justify-center items-center gap-3 w-[100vw] h-[100vh] overflow-hidden"
      >
        {#if isLoading}
          <img
            src=""
            bind:this={previewImg}
            alt="preview"
            class="absolute blur-sm min-w-full min-h-full opacity-20 object-cover"
          />
          <article
            class="absolute flex flex-col gap-8 justify-center items-center w-full h-full backdrop backdrop-blur-sm p-6 transition-all {isLoading
              ? 'z-20'
              : 'opacity-0'}"
          >
            <Hourglass />
            <!-- <span class="loading loading-infinity transform scale-[3] mb-4 mt-auto" /> -->
            <div class="grid gap-6">
              <div class="grid gap-1 text-center">
                <h2 class=" text-xl">Getting your picture from the future...</h2>
                <p class="text-gray-400 text-sm">Estimating time: 1 minute</p>
              </div>
              <div class="relative w-full h-1 bg-gray-200 rounded-full mt-auto overflow-hidden">
                <div
                  class="w-full h-full bg-gray-400 rounded-full {isLoading ? '-uploading' : ''}"
                />
              </div>
            </div>
          </article>
        {:else}
          <article class="flex flex-col gap-4 justify-center items-center z-20">
            <input
              class="z-10 block absolute opacity-0 w-full h-full cursor-pointer"
              type="file"
              disabled={isLoading}
              bind:files={image}
              on:change={process}
            />

            <UploadIcon class="transform w-20 h-20" fill="#333" stroke-width={0.5} />
            <h1 class="text-xl">Upload your face</h1>
          </article>
        {/if}
      </section>
    </form>
  {/if}
</main>
