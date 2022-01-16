import { get, writable } from "svelte/store";
import { browser } from "$app/env";
import { toast } from "./toasts";
import { OutboundQueue } from "./app/queue";
import type { File, MemoryUsage, Settings } from "./app/types";
import { TMP_FILE_NAME, WS_URL } from "./app/constants";

export const terminalLines = writable<string[]>([])
export const showLoader = writable(true)
export const status = writable('Awaiting Connection')
export const statusColor = writable('#433e61')

status.subscribe(value => {
    toast(value, 1000, get(statusColor))
})

export const currentStatus = writable('')

type SocketCallback = (msg: string) => void

function debugLog(value: string) {
    const lines = value.split(/\n/)
    const output: string[] = get(terminalLines)
    for (let line of lines) {
        if (line.length == 0 || line == '\n') continue
        output.push(line)
    }
    terminalLines.set(output)
}

class Socket {

    ws: WebSocket;
    queueOpen: boolean;

    updateInterval: NodeJS.Timer;
    statusInterval: NodeJS.Timer;

    queue: OutboundQueue;

    callback: SocketCallback;

    constructor() {
        this.queue = new OutboundQueue();
        this.queueOpen = false

        const ws = new WebSocket(WS_URL)
        status.set('Connecting')
        statusColor.set('#80c2e8')
        ws.onopen = () => {
            status.set('Connected')
            statusColor.set('#71a078')
            if (ws.readyState != WebSocket.OPEN) return
            showLoader.set(false)
            this.queueOpen = true;
        }
        ws.onmessage = (event: MessageEvent) => {
            const data = event.data
            console.debug('[WS] [IN] ' + data)
            if (this.callback) this.callback(data)
            this.queueOpen = true
            debugLog(data)
        }
        ws.onclose = () => {
            status.set('Disconnected')
            statusColor.set('#FF4477')
            if (this.updateInterval) clearInterval(this.updateInterval)
            if (this.statusInterval) clearInterval(this.statusInterval)
        }
        ws.onerror = (event: Event) => {
            status.set('Error')
            statusColor.set('#FF4477')
            console.error('[WS] [ERR] ' + event)
        }
        this.ws = ws;
        this.updateInterval = setInterval(() => this.update(), 1)
    }

    update() {
        if (this.queueOpen && this.queue.hasNext()) {
            const { msg, callback } = this.queue.pop()
            this.ws.send(msg)
            this.callback = callback
            this.queueOpen = false
            console.debug('[WS] [OUT] ' + msg)
            debugLog('> ' + msg);
        }
    }

    async send(message: string, skipQueue: boolean = false): Promise<string> {
        if (!message.endsWith('\n')) message += '\n'
        return this.queue.push(message, skipQueue)
    }

    async sendAll(messages: string[]): Promise<string[]> {
        const output = [];
        for (let message of messages) {
            output.push(await this.send(message));
        }
        return output
    }

    async getFiles(): Promise<File[]> {
        const response = await this.send('ls')
        const lines = response.split('\n')
        const files: File[] = []
        for (let line of lines) {
            if (line.length < 1) continue
            const [ name, size ] = line.split(' ', 2)
            files.push({ name, size })
        }
        return files
    }

    async getMemoryUsage(): Promise<MemoryUsage> {
        const response = await this.send('mem')
        const parse = (value: string): number => parseInt(value.split(' ', 1)[0])
        const [ totalBytes, usedBytes, freeBytes ] = response.split('\n', 3);

        return {
            total: parse(totalBytes),
            used: parse(usedBytes),
            free: parse(freeBytes)
        }
    }

    async formatDrive(): Promise<string> {
        return this.send('format')
    }

    cancelStatusUpdates(): void {
        if (this.statusInterval) clearInterval(this.statusInterval)
    }

    async startStatusUpdates(): Promise<void> {
        this.cancelStatusUpdates()
        await this.status()
        this.statusInterval = setInterval(async () => {
            const status = get(currentStatus)
            if (status.includes("running") || status.includes("saving")) {
                const status = await this.status()
                currentStatus.set(status)
            } else {
                this.cancelStatusUpdates();
            }
        }, 500)
    }

    async status(): Promise<string> {
        const value = await this.send('status')
        status.set(value)
        return value
    }

    realName(name: string): string {
        if (name.length > 0) {
            if (name[0] != '/') {
                name = '/' + name
            }
            name = name.replace(/ /g, '\-')
        }
        return name
    }

    async runScript(name: string): Promise<void> {
        await this.send(`run "${ this.realName(name) }"`)
        await this.startStatusUpdates()
    }

    async stopScript(name: string): Promise<void> {
        await this.send(`stop "${ this.realName(name) }"`)
    }

    async stopAll(): Promise<void> {
        await this.send('stop')
    }

    async readStream(): Promise<string> {
        let output = ''
        while (true) {
            status.set('Reading..')
            const data = await this.send('read')
            if (data == '> END') break
            output += data
        }
        await this.send('close')
        await this.status()
        return output
    }

    async streamFile(file: string): Promise<string> {
        await this.send(`stream "${ this.realName(file) }"`)
        return this.readStream()
    }

    async createFile(file: string): Promise<string> {
        await this.stopScript(file)
        return this.send(`create "${ this.realName(file) }"`)
    }

    async deleteFile(file: string): Promise<string> {
        await this.stopScript(file)
        return this.send(`remove "${ this.realName(file) }"`)
    }

    async autorun(file: string): Promise<string> {
        return this.send(`set autorun "${ this.realName(file) }"`)
    }

    async getSettings(): Promise<Settings> {
        const rawSettings: string = await this.send('settings');
        const lines: string[] = rawSettings.split(/\n/)
        const val = (value: string): string => value.split('=')[1]
        return {
            ssid: val(lines[0]),
            password: val(lines[1]),
            channel: val(lines[2]),
            autorun: val(lines[3]),
        }
    }

    async writeFile(file: string, content: string): Promise<void> {
        await this.stopScript(file)
        file = this.realName(file)
        await this.sendAll([
            `remove "${ TMP_FILE_NAME }"`,
            `create "${ TMP_FILE_NAME }"`,
            `stream "${ TMP_FILE_NAME }"`
        ])
        const chunkSize = 1024
        for (let i = 0; i < Math.ceil(content.length / chunkSize); i++) {
            const begin: number = i * chunkSize
            const end: number = Math.min(begin + chunkSize, content.length)
            await this.queue.push(content.substring(begin, end))
        }
        await this.sendAll([
            'close',
            `remove "${ file }"`,
            `rename "${ TMP_FILE_NAME }" "${ file }"`
        ])
        await this.status();
    }
}

export let socket: Socket

if (browser) {
    socket = new Socket()
}

export function reconnect() {
    if (browser) {
        socket = new Socket()
    }
}