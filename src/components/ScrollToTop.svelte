<script lang="ts">
  let showButton = $state<boolean>(false);
  let lastScrollY = 0;

  $effect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;

      if (currentY < 100) {
        showButton = false;
      } else if (currentY > lastScrollY) {
        // scrolling down
        showButton = true;
      } else {
        // scrolling up
        showButton = false;
      }

      lastScrollY = currentY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  });

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
</script>

<button
  onclick={scrollToTop}
  aria-label="Scroll to top"
  class="
    fixed bottom-5 right-5 z-50 backdrop-blur-sm w-10 h-10 rounded-full border border-dashed border-zinc-400 text-white
    transition-all duration-300 ease-in-out transform hover:cursor-pointer
  "
  class:opacity-0={!showButton}
  class:pointer-events-none={!showButton}
  class:translate-y-6={!showButton}
>
  ↑
</button>
