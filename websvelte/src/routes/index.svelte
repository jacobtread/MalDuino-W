<script>
    import { status, statusColor } from "../app.ts";
    import { toast } from "../toasts.ts";
    import Memory from "../components/Memory.svelte";
</script>
<div class="a">
    <div class="status-banner" style="background: {$statusColor}">{$status}</div>
    <Memory/>
    <div class="action-bar">
        <button class="button action-bar__button button--red">Stop Scripts</button>
        <button class="button action-bar__button button--yellow">Reconnect</button>
    </div>
    <button on:click={() => toast('Yes', 3000)}>
        Show Toast
    </button>
</div>
<style lang="scss">
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
    }
</style>