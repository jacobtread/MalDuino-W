<script lang="ts">

    import { socket } from "../app.ts";
    import { browser } from "$app/env";
    import { writable } from "svelte/store";
    import MemoryIcon from "../assets/icons/storage.svg"
    import Box from "./Box.svelte";

    const totalBytes = writable(0)
    const usedBytes = writable(0)
    const freeBytes = writable(0)

    export async function updateMemory() {
        const resp = await socket.getMemoryUsage()
        $totalBytes = resp.totalBytes
        $usedBytes = resp.usedBytes
        $freeBytes = resp.freeBytes
    }

    function formatMemory(value: number): string {
        // Bytes
        if (value / 1000000 > 1) {
            return (value / 1000000).toFixed(1) + 'mb'
        } else if (value / 1000 > 1) {
            return (value / 1000).toFixed(0) + 'kb'
        }
        return value + 'b'
    }

    if (browser) {
        updateMemory();
    }
</script>

<div class="memory">
    <Box icon={MemoryIcon}>
        <slot name="content" >
            <h2>Storage</h2>
            <div class="memory__bar"><span class="memory__bar__progress"
                                           style="width: {($usedBytes / $totalBytes) * 100}%"></span></div>
            <p class="memory__text">{formatMemory($usedBytes)} used of {formatMemory($totalBytes)}</p>
            <button class="button action-bar__button button--red memory__format">Format Storage</button>
        </slot>
    </Box>
</div>
<style lang="scss">
  @import "../assets/variables";

  .memory {

    &__format {
      margin-top: 1rem;
    }

    &__text {
      color: #666;
      font-size: 0.9rem;
    }

    &__bar {
      margin: 0.5rem 0;
      position: relative;
      display: block;
      width: 100%;
      background: #333;
      height: 5px;

      &__progress {
        position: absolute;
        left: 0;
        top: 0;
        width: 0;
        height: 100%;
        background: white;
      }

    }
  }

</style>