<script lang="ts">
    import { toasts } from "../toasts.ts"
    import { slide } from "svelte/transition";
</script>

<div class="toaster">
    {#each $toasts as toast}
        <div transition:slide={{duration: 300}} class="toast" style="background: {toast.color}">{toast.value}</div>
    {/each}
</div>

<style lang="scss">
  .toaster {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    display: flex;
    flex-flow: column-reverse;
    gap: 1rem;
  }

  .toast {
    flex: 0 0 auto;
    padding: 0.5rem 1rem;
    border-radius: 0.5rem;
    color: white;
    text-align: right;
    align-self: flex-end;
  }
</style>