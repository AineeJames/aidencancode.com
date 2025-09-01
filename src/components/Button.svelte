<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    href?: string;
    children: Snippet;
  }

  const { href, children }: Props = $props();

  const handleClick = () => {
    if (href) window.location.href = href;
  };
</script>

<button
  onclick={handleClick}
  class="bg-zinc-900 border border-dashed border-zinc-700 hover:cursor-pointer px-2 py-1 rounded-md
  hover:opacity-85 transition-opacity flex items-center"
>
  {@render children?.()}
</button>
