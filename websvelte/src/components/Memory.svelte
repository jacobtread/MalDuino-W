<script lang="ts">

    import { socket } from "../app.ts";
    import { browser } from "$app/env";
    import { writable } from "svelte/store";

    const totalBytes = writable('')
    const usedBytes = writable('')
    const freeBytes = writable('')

    export function updateMemory() {
        socket.send('mem', (msg) => {
            const lines = msg.split('\n')
            $totalBytes = lines[0].split(' ', 1)[0]
            $usedBytes = lines[1].split(' ', 1)[0]
            $freeBytes = lines[2].split(' ', 1)[0]
            paintGraph()
        })
    }

    function paintGraph() {
        const element: HTMLCanvasElement = document.getElementById('memoryGraph') as HTMLCanvasElement;
        const ctx = element.getContext('2d');
        const w = ctx.canvas.width;
        const h = ctx.canvas.height;

        const usage = parseInt($usedBytes) / parseInt($totalBytes)
        const usagePercent = usage * 100

        let percentText: string;
        if (usagePercent < 1) {
            percentText = '< 1%'
        } else {
            percentText = usagePercent.toFixed(1) + '%'
        }

        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.lineWidth = 17;
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = "center"
        ctx.font = '15px monospace'
        ctx.fillText(percentText, w / 2, h / 2 + 5, w + 12)
        const start = Math.PI * -0.5;
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#333333';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 40, start, start + (2 * Math.PI), false);
        ctx.stroke();

        ctx.lineWidth = 3;
        ctx.strokeStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(w / 2, h / 2, 40, start, start + ((2 * Math.PI) * usage), false);
        ctx.stroke();
    }

    if (browser) {
        updateMemory();
    }
</script>

<div>
    <div class="usage">
        <div class="usage__block">
            <h1 class="usage__block__title">Storage Usage</h1>
            <div class="usage__items">
                <div class="usage__items__value">
                    <span class="usage__items__value__title">Used</span>
                    <span class="usage__items__value__data">{$usedBytes} bytes</span>
                </div>
                <div class="usage__items__value">
                    <span class="usage__items__value__title">Free</span>
                    <span class="usage__items__value__data">{$freeBytes} bytes</span>
                </div>
                <div class="usage__items__value">
                    <span class="usage__items__value__title">Capacity</span>
                    <span class="usage__items__value__data">{$totalBytes} bytes</span>
                </div>
            </div>
        </div>
        <div class="usage__graph">
            <canvas id="memoryGraph" width="120" height="120"></canvas>
        </div>
    </div>
    <button class="format button">Format</button>
</div>
<style lang="scss">
  .format {
    display: block;
    width: 100%;
    margin-top: 1rem;
    font-size: 1.25rem;
  }

  .usage {
    display: flex;
    flex-flow: row;
    padding: 1rem;
    border-radius: 0.25rem;
    background: #181623;
    max-width: 450px;
    justify-content: space-between;
    color: #eee;
    align-items: center;

    &__graph {
      display: flex;
      flex-flow: column;
    }

    &__block {
      flex: auto;

      &__title {
        font-size: 1.5rem;
        margin-bottom: 1rem;
      }
    }

    &__items {
      display: flex;
      flex-flow: column;
      gap: 0.25rem;

      &__value {
        display: grid;
        grid-template-columns:  1fr 1fr;

        &__title {
          color: #c9c9c9;
          font-weight: bold;
        }

        &__data {
          color: #b6b6b6;
          text-align: right;
        }

      }
    }
  }

</style>