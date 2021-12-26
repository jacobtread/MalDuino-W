<script lang="ts">

    import { browser } from "$app/env";
    import { writable } from "svelte/store";
    import { socket } from "../app";
    import Memory from "./Memory.svelte";

    interface File {
        name: string;
        size: string;
    }

    const files = writable<File[]>([])

    export async function loadFiles() {
        $files = await socket.getFiles();
    }

    if (browser) {
        loadFiles();
    }

</script>

<div class="content">
    <Memory/>

    <div class="files">

        {#each $files as file}
            <div class="file">
                <div class="file__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" height="32px" viewBox="0 0 24 24" width="32px"
                         fill="currentColor">
                        <path d="M0 0h24v24H0z" fill="none"/>
                        <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                    </svg>
                </div>
                <span class="file__name">{file.name}</span>
                <span class="file__size">{file.size} bytes</span>
                <div class="file__actions">
                    <button class="button file__dit">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                             fill="currentColor">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                        </svg>
                    </button>
                    <button class="button file__run">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                             fill="currentColor">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                    <button class="button file__delete">
                        <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px"
                             fill="currentColor">
                            <path d="M0 0h24v24H0z" fill="none"/>
                            <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                        </svg>
                    </button>
                </div>
            </div>
        {/each}
    </div>
</div>


<style lang="scss">
  .content {
    display: flex;
    flex-flow: row;
    gap: 1rem;
    max-width: 1000px;
    margin: 1rem auto;
  }

  .file {
    display: flex;
    flex-flow: row;
    align-items: center;
    gap: 0.5rem;
    background: #1c1928;
    padding: 0.5rem;
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
        border-radius: 8px;
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