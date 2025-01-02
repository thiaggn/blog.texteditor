import {genKey, type IState} from "./base/IState";
import {snapshotService} from "../services/SnapshotService";
import type {Limit} from "../services/KeyboardService.svelte";
import {Result} from "./base/Result";


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

    private set value(v: string) {
        const old = this._value
        snapshotService.capture(() => this._value = old)
        this._value = v
    }

    get empty() {
        return this._empty
    }

    set empty(value: boolean) {
        const old = this._empty
        snapshotService.capture(() => this._empty = old)
        this._empty = value
    }

    public cut(start: number, end: number = this.length): Result {
        const lv = this.value.slice(0, start)
        const rv = this.value.slice(end)
        this.value = lv + rv
        return new Result(true, this.length)
    }


    public concat(other: WordState) {
        if (other.format == this.format) {
            this.value += other.value
            return new Result(true, this.length)
        }
        return new Result(false, 0)
    }
}

