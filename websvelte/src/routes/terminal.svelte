<script lang="ts">

    import { socket, terminalLines } from "../app.ts";
    import { browser } from "$app/env";
    import { afterUpdate, onMount } from "svelte";

    let lines


    let command: string

    function updateScroll() {
        if (lines) lines.scrollTop = lines.offsetTop + lines.offsetHeight
    }

    async function sendCommand() {
        await socket.send(command)
        command = ''
    }

    afterUpdate(updateScroll)

    if (browser) {
        onMount(updateScroll)
    }

</script>

<div class="terminal">
    <h1 class="terminal__title">Terminal</h1>
    <p class="terminal__desc">The terminal shows all commands being sent to the maldiuno. You can enter a command
        yourself using the input
        below</p>
    <pre class="terminal__lines" bind:this={lines}>
        <code>
{#each $terminalLines as line}
{line}<br>
{/each}
        </code>
    </pre>
    <form on:submit|preventDefault={sendCommand}>
        <input type="text" placeholder="Enter Command" class="input" bind:value={command}>
    </form>
    <p class="hint">Hint: Type "help" for a list of commands</p>
</div>


<style lang="scss">
  @import "../assets/variables";

  .hint {
    margin-top: 1rem;
    font-size: 1.2rem;
    color: #555;
  }

  .terminal__lines {
    padding: 1rem;
    background: black;
    color: #2dd92d;
    height: 500px;
    overflow-y: auto;
    margin-bottom: 1rem;
    font-family: monospace;
    font-size: 1.1rem;
  }

  .terminal__title {
    margin-bottom: 0.5rem;
    color: white;
  }

  .terminal__desc {
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }

  .input {
    display: block;
    padding: 1rem;
    width: 100%;
  }
</style>