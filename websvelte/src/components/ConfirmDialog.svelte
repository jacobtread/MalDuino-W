<script lang="ts">
    import { Writable } from "svelte/store";
    import Dialog from "./Dialog.svelte";

    export let open: Writable<boolean>

    export let title: string
    export let message: string

    export let confirmText: string
    export let denyText: string

    export let confirmAction: () => any
    export let denyAction: () => any

</script>

<Dialog open={open}>
    <h1 class="dialog__title">{title}</h1>
    <p class="dialog__text">{message}</p>
    <div class="button-group">
        <button class="button" on:click={confirmAction}>{confirmText}</button>
        <button class="button" on:click={denyAction}>{denyText}</button>
    </div>
</Dialog>

<style lang="scss">
  @import "../assets/variables";
</style>