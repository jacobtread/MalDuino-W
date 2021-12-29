<script lang="ts">

    import { browser } from "$app/env";
    import { get, writable } from "svelte/store";
    import { socket } from "../../app";
    import Editor from "../../components/Editor.svelte";

    import { page } from '$app/stores';

    import FileIcon from "../../assets/icons/file.svg"
    import Box from "../../components/Box.svelte";
    import { toast } from "../../toasts";

    const name = get(page).params.id;
    const contents = writable('')

    $: {
        console.log(get(contents))
    }

    export async function loadFile() {
        const response = await socket.streamFile(name)
        contents.set(response)
        toast(`Loaded file "${name}"`)
    }

    if (browser) {
        loadFile();
    }

</script>

<Box icon={FileIcon}>
    <h1 class="name">Editing {name}</h1>
    <Editor text={contents}/>
</Box>


<style lang="scss">
  .name {
    color: #ECECEC;
    margin: 1rem;
  }

</style>