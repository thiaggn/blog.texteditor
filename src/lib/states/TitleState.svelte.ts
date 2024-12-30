import {StringState} from "./base/StringState.svelte.js";
import {snapshotService} from "../services/SnapshotService";
import {FAILED_MERGE, genKey, MergeResult, type State} from "./base/State";
import  { Limit} from "../services/KeyboardService";
import {Reference} from "../services/ReferenceService";

export class TitleState extends StringState implements State {
    private _size = $state<number>(1)
    readonly key: number

    constructor(size: number, value: string) {
        super(value)
        this._size = size
        this.key = genKey()
    }

    get size() {
        return this._size
    }

    set size(v: number) {
        const old = this._size
        snapshotService.push(() => this._size = old)
        this._size = v
    }


    public merge(other: Readonly<State>, start: Limit | 0, end?: Limit): MergeResult {
        if (other instanceof TitleState) {
            let s = start === 0 ? 0 : start.offset
            let e = end ? end.offset : this.value.length

            return new MergeResult(true,
                super.mergestr(other.value, s, e)
            )
        }

        return FAILED_MERGE
    }
}