<script lang="ts">
    import type { Readable, Writable } from "svelte/store";
    import {fade} from "svelte/transition"

    export let open: Writable<boolean>

</script>

{#if $open}
    <div class="wrapper" transition:fade={{duration: 50}}>
        <div class="dialog">
            <slot/>
        </div>
    </div>
{/if}

<style lang="scss">
  @import "../assets/variables";

  .wrapper {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 9;
    transition: 0.2s ease;
  }

  .dialog {
    position: absolute;

    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
    max-width: 500px;

    background: darken($background, 3);
    padding: 1rem;
    border-radius: 0.5rem;
  }
</style>