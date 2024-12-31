import {StringState} from "./base/StringState.svelte.js";
import {FAILED_MERGE, genKey, RemovalResult, type State} from "./base/State";
import {Limit} from "../services/TextEventsService.svelte";

export enum WordFormat {
    Bold,
    Italic,
    Normal,
    Code,
}

export class WordState extends StringState implements State {
    readonly format: WordFormat
    readonly key: string

    constructor(format: WordFormat, value: string) {
        super(value);
        this.format = format
        this.key = genKey()
    }

    private reinterpret(start: Limit | 0, end?: Limit): [Limit, Limit] {
        if (start instanceof Limit && end == undefined)
            return [start, new Limit(start.address, this.value.length)]

        else if (start === 0 && end != undefined)
            return [new Limit(end.address, 0), end]

        else if (start instanceof Limit && end instanceof Limit)
            return [start, end]

        else throw new Error("unhandled case")
    }

    public merge(other: Readonly<State>, start: Limit | 0, end?: Limit): RemovalResult {
        [start, end] = this.reinterpret(start, end);

        if (other instanceof WordState && other.format == this.format) {
            let len = super.mergestr(other.value, start.offset, end.offset)
            return new RemovalResult(true,len)
        }

        return FAILED_MERGE
    }
}