<script lang="ts">

    import { browser } from "$app/env";
    import { get, writable } from "svelte/store";
    import { socket } from "../../app";

    import { page } from '$app/stores';

    import FileIcon from "../../assets/icons/file.svg"
    import SaveIcon from "../../assets/icons/save.svg"
    import RunIcon from "../../assets/icons/play.svg"

    import Box from "../../components/Box.svelte";
    import { toast } from "../../toasts";
    import { onMount } from "svelte";
    import ConfirmDialog from "../../components/ConfirmDialog.svelte";


    const name = get(page).params.name;
    const text = writable('')
    const isChanged = writable(false)
    let originalText = '';
    const saveDialog = writable(false)

    $: {
        console.log(get(text))
    }

    export async function loadFile() {
        const response = await socket.streamFile(name)
        originalText = response
        text.set(response)
        toast(`Loaded file "${ name }"`)
    }

    async function runFile() {
        if (get(isChanged)) {
            saveDialog.set(true)
            return
        }
        toast('Running script')
        await socket.runScript(name)
    }


    onMount(() => {
        if (browser) {
            loadFile();
        }
    })

    const highlighted = writable('')
    const highlightElm = writable()

    $: {
        const lines = $text.replace(/\u00A0/g, ' ').replace(/\u200B/g, '').split('\n')
        let output = ''
        for (let y = 0; y < lines.length; y++) {
            const line = lines[y];
            if (line.startsWith('REM')) {
                output += `<span style='color: #444;'>REM</span><span style="color: #777">${ line.substring(3) }</span><br>`
                continue
            }
            if (line.startsWith('STRING') || line.startsWith('LOCALE')) {
                output += `<span style='color: #96d77e;font-weight: 700;'>${ line.substring(0, 6) }</span><span style="color: #5a9966">${ line.substring(6) }</span><br>`
                continue
            }

            const KEYS = [
                'ENTER', 'MENU', 'APP', 'DELETE', 'HOME',
                'INSERT', 'PAGEUP', 'PAGEDOWN', 'UP', 'UPARROW',
                'DOWN', 'DOWNARRROW', 'LEFT', 'LEFTARROW', 'TAB',
                'END', 'ESC', 'ESCAPE', 'SPACE', 'PAUSE', 'BREAK',
                'CAPSLOCK', 'NUMLOCK', 'PRINTSCREEN', 'SCROLLLOCK'
            ];

            const MODIFIERS = [
                'WINDOWS', 'GUI', 'CTRL', 'CONTROL',
                'ALT', 'SHIFT'
            ]

            const parts = line.split(' ')
            let out = '';
            if (parts[0] == 'LED') {
                const parts = line.split(' ');

                out += '<span style="color:#8287e3; font-weight:700;">LED</span>'
                if (parts.length >= 2) {
                    out += ` <span style="color:#d77e7e;">${ parts[1] }</span>`
                }
                if (parts.length >= 3) {
                    out += ` <span style="color:#63d455;">${ parts[2] }</span>`
                }
                if (parts.length >= 4) {
                    out += ` <span style="color:#2ab5e8;">${ parts[3] }</span>`
                }
            } else {

                for (let x = 0; x < parts.length; x++) {
                    const part = parts[x];
                    if (part.endsWith('\n')) {
                        $highlightElm.scrollLeft = 0

                    }
                    if (part.length === 0) {
                        out += ' '
                        continue
                    }
                    let color = '#666'
                    let fontWeight = 500;
                    if (MODIFIERS.indexOf(part) !== -1) {
                        console.log(part)
                        color = '#62aed5'
                        fontWeight = 700
                    } else if (part.match(/^(REPEAT|DELAY|REPLAY|DEFAULTDELAY|DEFAULT_DELAY|LED)$/)) {
                        color = '#96d77e'
                        fontWeight = 700
                    } else if (part.match(/^[a-zA-Z0-9]$/) || KEYS.indexOf(part) !== -1) {
                        color = '#8287e3'
                    } else if (part.match(/^[1-9][0-9]*$/) || KEYS.indexOf(part) !== -1) {
                        color = '#8287e3'
                    } else if (part.match(/^F[1-9][0-2]?$/)) {
                        color = '#8f26b8'
                    } else if (part.match(/^[0-9]*x[0-9]*$/)) {
                        color = '#ffe169'
                    }
                    out += `<span style="color:${ color }; font-weight: ${ fontWeight };">${ part }</span> `
                }
            }
            output += out + '<br>'
        }
        highlighted.set(output)
        isChanged.set(get(text) != originalText)
    }

    function onScroll(e) {
        $highlightElm.scrollLeft = e.target.scrollLeft
        $highlightElm.scrollTop = e.target.scrollTop
    }

    function onKeyPress(event: KeyboardEvent) {
        const code: string = event.key.toLowerCase()
        const isCtrl = event.ctrlKey
        if (code == 's' && isCtrl) {
            toast('Saving file')
            saveFile().then(() => {
                toast('File saved')
            })
            event.preventDefault()
        }
    }


    async function saveFile() {
        saveDialog.set(false)
        await socket.writeFile(name, get(text))
        isChanged.set(false)
    }

    async function saveAnRun() {
        await saveFile()
        await runFile()
    }
</script>

<Box icon={FileIcon}>
    <div class="header">
        <h1 class="name">Editing {name}</h1>
        <div class="header__buttons">
            <button class="header__buttons__item" on:click={runFile}>
                <RunIcon/>
            </button>
            <button class="header__buttons__item" on:click={saveFile}>
                <SaveIcon/>
            </button>
        </div>
    </div>
    <div class="wrapper">
        <textarea class="area" bind:value={$text} on:scroll={onScroll} wrap="off" on:keydown={onKeyPress}></textarea>
        <pre class="viewer" bind:this={$highlightElm}>{@html $highlighted}</pre>
    </div>
</Box>

<ConfirmDialog
        open={saveDialog}
        title="Confirm save"
        message="This file has unsaved changes that must be saved before running would you like to save them?"
        confirmText="Save"
        denyText="Cancel"
        confirmAction={saveAnRun}
        denyAction={() => saveDialog.set(false)}
/>

<style lang="scss">
  @import "../../assets/variables";

  .name {
    color: #ECECEC;
    margin: 1rem 0;
    font-size: 1.5rem;
  }

  .header {
    display: flex;
    align-items: center;

    &__buttons {
      flex: auto;
      justify-content: flex-end;
      display: flex;

      &__item {
        color: #777;
        background: transparent;
        border: transparent;
        transition: 0.2s ease;
        cursor: pointer;

        &:hover {
          color: white;
        }
      }

    }
  }

  .wrapper {
    position: relative;

    height: 500px;
    width: 100%;
    margin: 0 auto;
    background: darken($background, 5);


    .area, .viewer {
      border: none;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      font-size: 15pt !important;
      font-family: monospace !important;
      line-height: 20pt !important;
      tab-size: 2;
      margin: 0;
      padding: 0.5rem;
      box-sizing: border-box;
      overflow: hidden;
      resize: none;

      outline: darken($background, 3) dashed;

      &:focus-within {
        outline: lighten($background, 10) dashed;
      }
    }

    .area {
      background: transparent;
      z-index: 1;
      color: transparent;
      caret-color: white;
      overflow: auto;
    }

    .viewer {
      pointer-events: none;
    }
  }

</style>