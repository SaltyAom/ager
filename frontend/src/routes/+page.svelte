<script lang="ts">
  import { api } from '$lib'
  import UploadIcon from '../components/icons/upload-icon.svelte'
  import Hourglass from '../components/hourglass.svelte'

  let image: FileList | undefined
  let isLoading = false
  let result: string | undefined
  let previewImg

  const process = async () => {
    if (isLoading) return
    isLoading = true

    if (!image) return

    const preview = image[0]
    if (preview) {
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        previewImg.setAttribute('src', reader.result)
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
  }
</script>

<main class="flex flex-col justify-center items-center w-full min-h-screen p-6">
  {#if result}
    <article class="flex flex-col max-w-lg">
      <figure class="m-0 bg-gray-100 rounded-3xl overflow-hidden">
        <img src={result} alt="Result" class="object-cover object-center" />
      </figure>

      <hr class="w-full h-0.5 my-8 bg-gray-100 rounded" />
    </article>
  {/if}

  <form class="flex flex-col gap-4" on:submit|preventDefault={process}>
    <section
      class="relative flex flex-col justify-center items-center gap-3 aspect-square w-72 border-2 rounded-3xl overflow-hidden"
    >
      <article
        class="absolute flex flex-col justify-center items-center w-full h-full bg-white/10 backdrop backdrop-blur-sm p-6 transition-all {isLoading
          ? 'z-20'
          : 'opacity-0'}"
      >
        <img
          bind:this={previewImg}
          src=""
          alt="preview"
          class="absolute blur-sm min-w-full min-h-full -z-20 opacity-20"
        />
        <Hourglass />
        <!-- <span class="loading loading-infinity transform scale-[3] mb-4 mt-auto" /> -->
        <div class="grid gap-1 text-center">
          <h2 class="text-gray-200 text-xl">Getting your picture from the future...</h2>
          <p class="text-gray-400 text-sm">Estimating time: 1 minute</p>
        </div>
        <div class="relative w-full h-1 bg-gray-200 rounded-full mt-auto overflow-hidden">
          <div class="w-full h-full bg-black rounded-full {isLoading ? '-uploading' : ''}" />
        </div>
      </article>
      <input
        class="z-10 block absolute opacity-0 w-full h-full cursor-pointer"
        type="file"
        disabled={isLoading}
        bind:files={image}
        on:change={process}
      />

      <UploadIcon class="transform w-14 h-14 text-gray-700" stroke-width={1.5} />
      <h1 class="text-xl font-medium text-gray-700">Upload Image</h1>
    </section>
  </form>
</main>
