<script>
    import { socket, status, statusColor, reconnect } from "../app.ts";
    import Memory from "../components/Memory.svelte";
    import ConfirmDialog from "../components/ConfirmDialog.svelte";
    import { writable } from "svelte/store";
    import { toast } from "../toasts.ts";
    import { browser } from "$app/env";

    const confirmFormat = writable(false)

    async function format() {
        confirmFormat.set(false)
        toast('Formatting drive...')
        await socket.formatDrive()
    }

    async function r() {
        toast('Reconnecting')
        reconnect()
    }

</script>
<div class="a">
    <div class="status-banner" style="border-bottom: 3px solid {$statusColor}">{$status}</div>
    <Memory/>
    <div class="action-bar">
        <button class="button action-bar__button button--red" on:click={() => confirmFormat.set(true)}>Format Storage
        </button>
        <button class="button action-bar__button button--red">Stop Scripts</button>
        <button class="button action-bar__button button--yellow" on:click={reconnect}>Reconnect</button>
    </div>
</div>
<ConfirmDialog
        title="Confirm Format"
        message="Are you sure you want to format the storage? This will remove all of your scripts"
        confirmText="Format"
        denyText="Cancel"
        confirmAction={format}
        denyAction={() => confirmFormat.set(false)}
        open={confirmFormat}/>
<style lang="scss">
  @import "../assets/variables";

  .action-bar {
    margin: 1rem 0;
    display: flex;
    gap: 1rem;
  }

  .status-banner {
    margin-bottom: 2rem;
    padding: 0.5rem 1rem;
    color: white;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 2px;
    font-size: 1.1rem;
    background: darken($background, 4);
  }
</style>