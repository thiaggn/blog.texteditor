import {genKey, type IState} from "./base/State";
import {snapshotService} from "../services/SnapshotService";
import {Limit} from "../services/KeyboardService.svelte";


export enum WordFormat {
    Bold,
    Italic,
    Normal,
    Code,
}

export class WordState implements IState {
    readonly format: WordFormat
    readonly key: string
    private _value = $state("")
    private _empty = $state(false)

    constructor(format: WordFormat, value: string) {
        this.format = format
        this.key = genKey()
        this._value = value
    }

    get length(): number {
        return this._value.length
    }

    get value() {
        return this._value
    }

    set value(v: string) {
        const old = this._value
        snapshotService.capture(() => this._value = old)
        this._value = v
    }

    get empty() {
        return this._empty
    }

    set empty(v: boolean) {
        const old = this._empty
        snapshotService.capture(() => this._empty = old)
        this._empty = v
    }

    public remove(start: number, end: number = this.value.length): number {
        const lv = this.value.slice(0, start)
        const rv = this.value.slice(end)

        this.value = lv + rv
        return this.value.length
    }

    public merge(other: WordState, start: number, end: number): number {
        if (other.format == this.format) {
            let sv = this.value.slice(0, start)
            let ev = other.value.slice(end)
            this.value = sv + ev
            return this.value.length
        }

        return 0
    }
}