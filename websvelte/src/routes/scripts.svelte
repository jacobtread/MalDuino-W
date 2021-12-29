<script lang="ts">

    import { browser } from "$app/env";
    import { get, writable } from "svelte/store";
    import { socket } from "../app";
    import FileIcon from "../assets/icons/file.svg"
    import PlayIcon from "../assets/icons/play.svg"
    import EditIcon from "../assets/icons/edit.svg"
    import DeleteIcon from "../assets/icons/delete.svg"
    import Box from "../components/Box.svelte";

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
        await socket.deleteFile(file.name)
        await loadFiles()
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
                        <button class="button file__dit">
                            <EditIcon/>
                        </button>
                        <button class="button file__run">
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

    &__icon {
      color: gray;
    }

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