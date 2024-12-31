import {snapshotService} from "../../services/SnapshotService";
import {type Limit} from "../../services/TextEventsService.svelte";
import {RemovalResult, type State} from "./State";

export class StringState  {
    private _value = $state<string>("")
    private _empty = $state(false)

    constructor(value: string) {
        this._value = value
    }

    get value(): string {
        return this._value
    }

    set value(v: string) {
        const old = this._value
        snapshotService.push(() => this._value = old)
        this._value = v
    }

    get empty() {
        return this._empty
    }

    set empty(value: boolean) {
        const old = this._empty
        snapshotService.push(() => this._empty = old)
        this._empty = value
    }

    public crop(left: Limit | 0, right?: Limit): RemovalResult {
        let start = left == 0 ? 0 : left.offset
        let end = right ? right.offset : this.value.length

        this.value = this.value.slice(0, start) + this.value.slice(end)
        return new RemovalResult(true, this.value.length)
    }

    public mergestr(other: string, start: number, end: number): number {
        const lv = this.value.slice(0, start)
        const rv = other.slice(end)

        this.value = lv + rv
        return this.value.length
    }
}