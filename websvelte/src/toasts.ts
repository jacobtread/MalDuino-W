import { get, writable } from "svelte/store";

export let toasts = writable<ToastData[]>([])

interface ToastData {
    id: string;
    value: string;
    color: string;
}

export enum ToastType {
    NORMAL = '#433e61',
    ERROR = '#db7777',
    GOOD = '#68ac82'
}

function removeToast(id: string) {
    let values = get(toasts)
    values = values.filter(value => value.id != id)
    toasts.set(values)
}

export function toast(text: string, delay = 1000, type: string = ToastType.NORMAL) {
    const id = `${ new Date().getTime() }-${ Math.floor(Math.random() * 9999) }`
    const values = get(toasts);
    values.push({ id, value: text, color: type });
    toasts.set(values)
    setTimeout(() => {
        removeToast(id)
    }, delay)
}