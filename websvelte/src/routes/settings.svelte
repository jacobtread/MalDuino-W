<script lang="ts">

    import { browser } from "$app/env";
    import { showLoader, socket, status } from "../app";
    import { writable } from "svelte/store";
    import type { Settings } from "../app/types";
    import { File } from "../app/types";
    import InputDialog from "../components/InputDialog.svelte";
    import { toast, ToastType } from "../toasts";
    import Box from "../components/Box.svelte";
    import ConfirmDialog from "../components/ConfirmDialog.svelte";

    const settings = writable<Settings>()
    const scripts = writable<File[]>()
    const originalSettings = writable<Settings>()

    async function loadSettings() {
        $settings = await socket.getSettings()
        $originalSettings = $settings
        $scripts = await socket.getFiles()
    }


    if (browser) {
        loadSettings()
    }

    const changeSSID = writable(false)
    const changePassword = writable(false)
    const changeChannel = writable(false)

    async function setSSID(value: string) {
        value = value.trim()
        if (value.length < 1 || value.length > 32) {
            toast('SSID must be between 1 and 32 chars long', 1000, ToastType.ERROR)
            return
        }
        changeSSID.set(false)
        showLoader.set(true)
        status.set('Updating SSID')
        await socket.send(`set ssid "${ value }"`)
        await loadSettings()
        showLoader.set(false)
        await socket.status()
        toast('Updated SSID')
    }

    async function setPassword(value: string) {
        value = value.trim()
        if (value.length < 8 || value.length > 64) {
            toast('Password must be between 8 and 64 chars long', 1000, ToastType.ERROR)
            return
        }
        changePassword.set(false)
        showLoader.set(true)
        status.set('Updating Password')
        await socket.send(`set password "${ value }"`)
        await loadSettings()
        showLoader.set(false)
        await socket.status()
        toast('Updated password')
    }

    async function setChannel(value: string) {
        value = value.trim()
        const intValue = parseInt(value)
        if (isNaN(intValue)) {
            toast('Channel must be a number!', 1000, ToastType.ERROR)
            return
        }
        if (intValue < 1 || intValue > 13) {
            toast('Channel must be between 1 and 14', 1000, ToastType.ERROR)
            return
        }
        changeChannel.set(false)
        showLoader.set(true)
        status.set('Updating Channel')
        await socket.send(`set channel "${ value }"`)
        await loadSettings()
        showLoader.set(false)
        await socket.status()
        toast('Updated channel')
    }

    const confirmReset = writable(false)
    let autorunScript = ''

    async function setAutorun() {
        status.set('Setting Autorun')
        showLoader.set(true)
        if (autorunScript == 'none') {
            await socket.send(`set autorun ""`)
        } else {
            await socket.send(`set autorun "${ socket.realName(autorunScript) }"`)
        }
        showLoader.set(false)
        await socket.status()
        toast('Updated Autorun')
    }

    async function resetSettings() {
        confirmReset.set(false)
        status.set('Resetting settings')
        showLoader.set(true)
        await socket.send('reset')
        showLoader.set(false)
        await socket.status()
        toast('Reset Settings')
    }

</script>

<div class="settings">
    <h1>Settings</h1>

    {#if $settings}
        <Box>
            <h2 class="setting__name">SSID</h2>
            <p class="setting__value">{$settings.ssid}</p>
            <button class="button" on:click={() => changeSSID.set(true)}>Change</button>
            <InputDialog
                    open={changeSSID}
                    title="Change SSID"
                    message="Please enter the new SSID keep this between 1 and 32 chars"
                    confirmAction={setSSID}
                    denyAction={() => changeSSID.set(false)}
                    confirmText="Set"
                    denyText="Cancel"
            />
        </Box>
        <Box>
            <h2 class="setting__name">Password</h2>
            <p class="setting__value">{$settings.password}</p>
            <button class="button" on:click={() => changePassword.set(true)}>Change</button>
            <InputDialog
                    open={changePassword}
                    title="Change SSID"
                    message="Please enter the new Password keep this between 8 and 64 chars"
                    confirmAction={setPassword}
                    denyAction={() => changePassword.set(false)}
                    confirmText="Set"
                    denyText="Cancel"
            />
        </Box>
        <Box>
            <h2 class="setting__name">Channel</h2>
            <p class="setting__value">{$settings.channel}</p>
            <button class="button" on:click={() => changeChannel.set(true)}>Change</button>
            <InputDialog
                    open={changeChannel}
                    title="Change Channel"
                    message="Please enter the new Channel keep this between 1 and 14 chars"
                    confirmAction={setChannel}
                    denyAction={() => changeChannel.set(false)}
                    confirmText="Set"
                    denyText="Cancel"
            />
        </Box>
        {#if $scripts}
            <Box>
                <h2 class="setting__name">Autorun Script</h2>
                <p class="setting__desc">Choose a script that will run automatically when plugged in</p>
                <select bind:value={autorunScript} on:change={setAutorun} class="select input">
                    <option value="none">None</option>
                    {#each $scripts as script}
                        <option value={script.name}>{script.name}</option>
                    {/each}
                </select>
            </Box>
        {/if}

    {/if}
    <Box>
        <h2 class="setting__name">Update</h2>
        <p class="setting__desc">Provide a update bin file to install</p>
        <form method='POST' action='/update' enctype='multipart/form-data' class="update">
            <input type='file' name='update' class="button button--blue update__button">
            <button type='submit' class="button update__button">Upload</button>
        </form>
    </Box>
    <ConfirmDialog
            open={confirmReset}
            title="Confirm Reset"
            message="Are you sure you want to reset? This will set all settings back to default"
            confirmAction={resetSettings}
            denyAction={() => confirmReset.set(false)}
            confirmText="Reset"
            denyText="Cancel"
    />
    <button class="button button--red" on:click={() => confirmReset.set(true)}>Reset</button>
</div>


<style lang="scss">
  @import "../assets/variables";

  .select {
    color: white;
    background: $background;
  }

  .settings {
    display: flex;
    flex-flow: column;
    gap: 1rem;
  }

  .setting__name, .setting__value, .setting__desc {
    margin-bottom: 0.5rem;
  }

  .update__button {
    width: 100%;
    margin-bottom: 0.5rem;
  }


</style>