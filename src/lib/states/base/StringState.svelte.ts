import {snapshotService} from "../../services/SnapshotService";
import {type Limit} from "../../services/KeyboardService";
import {MergeResult, type State} from "./State";

export class StringState  {
    private _value = $state<string>("")

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

    public crop(left: Limit | 0, right?: Limit): MergeResult {
        let start = left == 0 ? 0 : left.offset
        let end = right ? right.offset : this.value.length

        const nv = this.value.slice(0, start) + this.value.slice(end)

        if (nv.length > 0) {
            this.value = nv
        }

        return new MergeResult(true, nv.length)
    }

    public mergestr(other: string, start: number, end: number): number {
        const lv = this.value.slice(0, start)
        const rv = other.slice(end)

        if (lv.length + rv.length > 0) {
            this.value = lv + rv
            return this.value.length
        }

        return 0
    }
}