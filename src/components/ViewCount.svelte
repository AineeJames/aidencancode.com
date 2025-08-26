<script lang="ts">
  import { type ActionError, actions } from "astro:actions";

  interface Props {
    postSlug: string;
    increment?: boolean;
  }

  const { postSlug, increment = false, ...restProps }: Props = $props();

  let isLoading = $state<boolean>(true);
  let viewCount = $state<string>("0");

  $effect(() => {
    const fetchData = async () => {
      const { data, error } = await actions.getViews({ postSlug });
      if (error) console.error(error);

      if (increment) {
        const { error } = await actions.incViews({ postSlug });
        if (error) console.error(error);
      }

      isLoading = false;

      viewCount = data?.toLocaleString() || "0";
    };

    fetchData();
  });
</script>

<span {...restProps}>
  {isLoading ? "…" : viewCount}
</span>
