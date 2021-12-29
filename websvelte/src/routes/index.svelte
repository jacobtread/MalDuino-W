<script>
    import { status } from "../app.ts";
    import { toast } from "../toasts.ts";
</script>
<div class="a">
    {$status}
    <button on:click={() => toast('Yes')}>
        Show Toast
    </button>
</div>