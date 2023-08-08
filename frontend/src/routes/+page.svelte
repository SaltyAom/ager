<script lang="ts">
  import { api } from '$lib'
  import UploadIcon from '../components/icons/upload-icon.svelte'

  let image: FileList | undefined
  let isLoading = false
  let result: string | undefined

  const process = async () => {
    if (isLoading) return
    isLoading = true

    if (!image) return

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
      class="relative flex flex-col justify-center items-center gap-3 w-48 h-48 border-2 rounded-3xl overflow-hidden"
    >
      <article
        class="absolute flex flex-col justify-center items-center w-full h-full gap-1 pt-12 bg-white/80 backdrop backdrop-blur-sm p-4 transition-all {isLoading
          ? 'z-20'
          : 'opacity-0'}"
      >
        <span class="loading loading-infinity transform scale-[3] mb-4 mt-auto" />
        <h2 class="text-gray-700 text-xl">Processing</h2>
        <p class="text-gray-500">Est time: 1 minute</p>
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
