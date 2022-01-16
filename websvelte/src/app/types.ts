export type CLI_COMMAND = 'help' | ''

export interface File {
    name: string;
    size: string;
}

export interface MemoryUsage {
    total: number;
    used: number;
    free: number;
}

export interface Settings {
    ssid: string;
    password: string;
    channel: string;
    autorun: string;
}