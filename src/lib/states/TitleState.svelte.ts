import {snapshotService} from "../services/SnapshotService";
import {Limit} from "../services/KeyboardService.svelte.js";
import type {IBlockState} from "./base/IBlockState";
import {TextBlockState} from "./base/TextBlockState";
import {Result} from "./base/Result";
import {selection} from "../services/SelectionService.svelte";

export class TitleState extends TextBlockState {
    private _size = $state<number>(1)
    private _empty = $state(false)
    private _value = $state("")

    constructor(size: number, value: string) {
        super()
        this._size = size
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

    get size() {
        return this._size
    }

    set size(v: number) {
        const old = this._size
        snapshotService.capture(() => this._size = old)
        this._size = v
    }

    public concat(other: IBlockState): Result {
        if (other instanceof TitleState) {
            const caret_index = this.length
            this.value = this.value.concat(other.value)
            selection.collapse(this.key, caret_index)
            return new Result(true, this.length)
        }

        return new Result(false, 0)
    }

    public cut(start: 0 | Limit, end?: Limit): Result {
        return this._cut(start == 0 ? 0 : start.offset, end ? end.offset : this.length)
    }

    private _cut(soff: number, eoff: number): Result {

        if (soff < 0) {
            return new Result(false, 0)
        }

        const lv = this.value.slice(0, soff)
        const rv = this.value.slice(eoff)
        this.value = lv.concat(rv)
        return new Result(true, this.length)
    }
}