export type QueueCallback = (msg: string) => void

export interface QueueEntry {
    msg: string;
    callback: QueueCallback
}

export class OutboundQueue {

    entries: QueueEntry[] = [];

    /**
     * Pushes the command to the queue. Optionally pushes
     * the value to the head of the queue if head is true
     *
     * @async
     * @param cmd The command to push
     * @param head Whether to place it at the head
     * @return The promise for when the cmd is processed
     */
    async push(cmd: string, head: boolean = false): Promise<string> {
        return new Promise(resolve => {
            const method = head ? 'unshift' : 'push'
            this.entries[method]({ msg: cmd, callback: resolve })
        })
    }

    /**
     * Gets the last item in the entries list
     *
     * @return The last queue item in the list
     */
    pop(): QueueEntry {
        return this.entries.shift();
    }

    /**
     * Checks if there are any more entries remaining
     *
     * @return If there was another item
     */
    hasNext(): boolean {
        return this.entries.length > 0;
    }
}
