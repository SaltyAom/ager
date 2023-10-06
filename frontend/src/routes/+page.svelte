<script lang="ts">
  import { api } from '$lib'
  import UploadIcon from '../components/icons/upload-icon.svelte'
  import Hourglass from '../components/hourglass.svelte'
  import QRCode from 'qrcode'

  import { onMount } from 'svelte'

  let image: FileList | undefined
  let isLoading = false
  let result: string | undefined
  let previewImg: HTMLImageElement
  let btn: HTMLButtonElement, vid: HTMLVideoElement, canvas: HTMLCanvasElement
  let qrImgSrc: string

  let takepicture = () => {}
  let streaming = false

  const width = 320
  const height = width

  const generateQR = async (text: string) => {
    try {
      return QRCode.toDataURL(text)
    } catch (err) {
      return ''
      console.error(err)
    }
  }

  const process = async (image: string) => {
    if (isLoading) return
    isLoading = true

    // if (!image) return

    // const preview = image[0]

    // if (preview) {
    //   const reader = new FileReader()
    //   reader.addEventListener('load', () => {
    //     previewImg.setAttribute('src', reader.result || '')
    //   })
    //   reader.readAsDataURL(preview)
    // }

    const imgFile = await fetch(image)
      .then((res) => res.blob())
      .then((blob) => {
        return new File([blob], 'img', { type: 'image/png' })
      })

    result = undefined
    const { data, error } = await api.index.put({
      image: imgFile
    })

    isLoading = false
    if (error) return

    result = data
    qrImgSrc = await generateQR(result || '')
  }

  onMount(() => {
    takepicture = () => {
      const context = canvas.getContext('2d')
      if (width && height) {
        canvas.width = width
        canvas.height = height
        if (context) {
          context.drawImage(vid, 0, 0, width, height)
          const data: string = canvas.toDataURL('image/png')
          previewImg.setAttribute('src', data)
          process(data)
        }
      }
    }

    vid.addEventListener(
      'canplay',
      () => {
        if (!streaming) {
          vid.setAttribute('width', '' + width)
          vid.setAttribute('height', '' + height)
          canvas.setAttribute('width', '' + width)
          canvas.setAttribute('height', '' + height)
          streaming = true
        }
      },
      false
    )

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        vid.srcObject = stream
        vid.play()
      })
      .catch((err) => {
        console.error(`An error occurred: ${err}`)
      })
  })
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
      class="absolute bottom-0 m-8 px-4 py-2 flex justify-center items-center gap-2"
      on:click={() => {
        result = ''
        isLoading = false
      }}><UploadIcon class="w-5 h-5" fill="#eee" stroke-width={0.5} /> Get another image</button
    >
  {:else}
    <img
      src=""
      bind:this={previewImg}
      alt="preview"
      class="absolute top-0 left-0 aspect-video blur-sm min-w-full min-h-full opacity-20 object-cover"
    />
    <form class="flex flex-col gap-4">
      <section class="relative flex flex-col text-gray-600 justify-center items-center gap-3">
        {#if isLoading}
          <!-- <img
            src=""
            bind:this={previewImg}
            alt="preview"
            class="absolute blur-sm min-w-full min-h-full opacity-20 object-cover"
          /> -->
          <article
            class="absolute flex flex-col gap-8 justify-center items-center min-w-full min-h-full backdrop backdrop-blur-sm p-6 transition-all {isLoading
              ? 'z-20'
              : 'opacity-0'}"
          >
            <Hourglass />
            <!-- <span class="loading loading-infinity transform scale-[3] mb-4 mt-auto" /> -->
            <div class="grid gap-6">
              <div class="grid gap-1 text-center w-[70vw]">
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
            <!-- <input
              class="z-10 block absolute opacity-0 w-full h-full cursor-pointer"
              type="file"
              disabled={isLoading}
              bind:files={image}
              on:change={process}
            />

            <UploadIcon class="transform w-20 h-20" fill="#333" stroke-width={0.5} />
            <h1 class="text-xl">Upload your face</h1> -->

            <div class="flex flex-col justify-center items-center gap-8">
              <video
                playsinline
                id="video"
                class="aspect-square border object-cover"
                bind:this={vid}
                style={`width:${width}px`}>Video stream not available.</video
              >
              <button
                bind:this={btn}
                on:click|preventDefault={() => {
                  takepicture()
                }}
                class="flex justify-center items-center text-lg gap-2 px-6 py-4 h-12"
                ><UploadIcon
                  class="transform w-6 aspect-square"
                  fill="#eee"
                  stroke-width={0.5}
                />Take a picture</button
              >
            </div>
          </article>
        {/if}
      </section>
    </form>
  {/if}
  <canvas id="canvas" class="absolute opacity-0 h-[320px] aspect-square -z-50" bind:this={canvas} />
</main>

<style>
  button {
    @apply bg-neutral-900  text-neutral-50 rounded-full  shadow-sm  transition-shadow;
  }
  button:hover {
    @apply bg-neutral-800 shadow-md;
  }
</style>
