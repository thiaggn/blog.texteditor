import {StringState} from "./base/StringState.svelte.js";
import {FAILED_MERGE, genKey, MergeResult, type State} from "./base/State";
import  {Limit} from "../services/KeyboardService";
import {Reference} from "../services/ReferenceService";

export enum WordFormat {
    Bold,
    Italic,
    Normal,
    Code,
}

export class WordState extends StringState implements State {
    readonly format: WordFormat
    readonly key: number

    constructor(format: WordFormat, value: string) {
        super(value);
        this.format = format
        this.key = genKey()
    }

    private reinterpret(start: Limit | 0, end?: Limit): [Limit, Limit] {
        if (start instanceof Limit && end == undefined) {
            return [start, new Limit(start.ref, this.value.length)]
        } else if (start === 0 && end != undefined) {
            return [new Limit(end.ref, 0), end]
        } else if (start instanceof Limit && end instanceof Limit) {
            return [start, end]
        } else throw new Error("unhandled case")
    }

    public merge(other: Readonly<State>, start: Limit | 0, end?: Limit): MergeResult {
        [start, end] = this.reinterpret(start, end);

        if (other instanceof WordState && other.format == this.format) {

            return new MergeResult(true,
                super.mergestr(other.value, start.offset,end.offset)
            )
        }

        return FAILED_MERGE
    }

}