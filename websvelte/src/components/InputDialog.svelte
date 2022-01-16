<script lang="ts">
    import { get, writable, Writable } from "svelte/store";
    import Dialog from "./Dialog.svelte";

    const value = writable('')

    export let open: Writable<boolean>

    export let title: string
    export let message: string

    export let confirmText: string
    export let denyText: string

    export let confirmAction: (value: string) => any
    export let denyAction: () => any

    function complete() {
        confirmAction(get(value))
        value.set('')
    }

</script>

<Dialog open={open}>
    <form on:submit|preventDefault={complete}>
        <h1 class="dialog__title">{title}</h1>
        <p class="dialog__text">{message}</p>
        <input type="text" bind:value={$value} class="input dialog__input"/>
        <div class="button-group">
            <button class="button" type="submit">{confirmText}</button>
            <button class="button" type="button" on:click={denyAction}>{denyText}</button>
        </div>
    </form>
</Dialog>

<style lang="scss">
  @import "../assets/variables";

  .dialog__input {
    margin-bottom: 1.5rem;
    display: block;
    width: 100%;
    padding: 0.5rem;
  }
</style>