import {snapshotService} from "../services/SnapshotService";
import {TextBlockState} from "./base/State";
import {Limit} from "../services/KeyboardService.svelte.js";

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

    public remove(start: Limit | 0, end?: Limit): number {
        if (start == 0 && end) {
            start = end.copy()
            start.offset = 0

        } else if (start instanceof Limit && end == undefined) {
            end = start.copy()
            end.offset = this.length
        } else throw new Error()

        return this.merge(this, start, end)
    }

    public merge(other: TextBlockState, start: Limit, end: Limit): number {
        if (other instanceof TitleState) {
            let sv = this.value.slice(0, start.offset)
            let ev = other.value.slice(end.offset)

            this.value = sv + ev
            return this.value.length
        }
        
        return 0
    }

    public getPathToLastLeaf(): number[] {
        return [this.length];
    }

    public getPathToFirstLeaf(): number[] {
        return [0];
    }
}