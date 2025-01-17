<script lang="ts">

    import { browser } from "$app/env";
    import { get, writable } from "svelte/store";
    import { socket } from "../app";
    import FileIcon from "../assets/icons/file.svg"
    import PlayIcon from "../assets/icons/play.svg"
    import EditIcon from "../assets/icons/edit.svg"
    import DeleteIcon from "../assets/icons/delete.svg"
    import Box from "../components/Box.svelte";
    import { toast } from "../toasts";

    interface File {
        name: string;
        size: string;
    }

    const files = writable<File[]>([])
    const fileName = writable('')

    export async function loadFiles() {
        $files = await socket.getFiles();
    }

    if (browser) {
        loadFiles();
    }

    async function createFile() {
        const name = get(fileName)
        if (name.length < 1) return
        await socket.createFile(name)
        await loadFiles()
    }

    async function deleteFile(file: File) {
        if (confirm('Are you sure you want to delete this file?')) {
            await socket.deleteFile(file.name)
            await loadFiles()
        }
    }

    async function runFile(file: File) {
        toast('Running script ' + file.name)
        await socket.runScript(file.name)
    }


</script>

<div class="content">
    <div class="actions">
        <input type="text" placeholder="Name" class="input" bind:value={$fileName}/>
        <button class="button" on:click={createFile}>Create</button>
    </div>
    <div class="files">

        {#each $files as file}
            <Box icon={FileIcon}>
                <div class="file">
                    <span class="file__name">{file.name}</span>
                    <span class="file__size">{file.size} bytes</span>
                    <div class="file__actions">
                        <a class="button file__edit" href="/edit{file.name}">
                            <EditIcon/>
                        </a>
                        <button class="button file__run" on:click={runFile(file)}>
                            <PlayIcon/>
                        </button>
                        <button class="button file__delete" on:click={deleteFile(file)}>
                            <DeleteIcon/>
                        </button>
                    </div>
                </div>
            </Box>
        {/each}
    </div>
</div>


<style lang="scss">
  .content {
    display: flex;
    flex-flow: column;
    gap: 2rem;
  }

  .actions {
    display: flex;
    gap: 1rem;
  }

  .file {
    display: flex;
    flex-flow: row;
    align-items: center;
    gap: 0.5rem;
    color: #fff;
    border-radius: 8px;

    &__name {
      font-size: 1.25rem;
    }

    &__size {
      color: #666;
    }

    &__actions {
      display: flex;
      flex: auto;
      justify-content: flex-end;
      gap: 0.5rem;

      .button {
        padding: 0;
        background: transparent;
      }
    }
  }

  .files {
    flex: auto;
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }
</style>