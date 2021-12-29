<script>

    import { writable } from "svelte/store";

    export let text
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
                console.log(part)
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
            output += out + '<br>'
        }
        $highlighted = output
    }

    function onScroll(e) {
        $highlightElm.scrollLeft = e.target.scrollLeft
        $highlightElm.scrollTop = e.target.scrollTop
    }

</script>

<div class="wrapper">
    <textarea class="area" bind:value={$text} on:scroll={onScroll} wrap="off"></textarea>
    <pre class="viewer" bind:this={$highlightElm}>{@html $highlighted}</pre>
</div>

<style lang="scss">
  .wrapper {
    position: relative;

    height: 500px;
    width: 100%;
    margin: 0 auto;
    background: #161421;
    max-width: 1000px;

    .area, .viewer {
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