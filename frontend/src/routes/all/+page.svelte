<script lang="ts">
  import { getAgers } from '$lib'
  import { getAgerImage, type Ager, onNewAger } from '$lib/supabase'
  import { onMount } from 'svelte'

  let agers: Ager[] | undefined

  onMount(async () => {
    agers = await getAgers()

    onNewAger((ager) => {
      agers = [...agers!, ager]
    })
  })
</script>

<main class="flex flex-col justify-start items-center w-full min-h-screen">
  <article
    class="fixed flex flex-col justify-center items-center w-full h-screen p-6 transform transition-opacity {agers
      ? 'opacity-0 pointer-events-none'
      : 'opacity-100'}"
  >
    <span class="loading loading-ring transform scale-[3]" />
  </article>
  {#if agers}
    <ul class="gallery gap-1">
      {#each agers as ager (ager.id)}
        {@const { input, processed } = getAgerImage(ager.id)}
        <li>
          <a href={processed} target="_blank" class="block w-full h-full bg-white overflow-hidden">
            <img loading="lazy" src={processed} alt="Aged" class="object-cover object-center" />
          </a>
        </li>
      {/each}
    </ul>
  {/if}
</main>
