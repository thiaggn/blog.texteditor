import {snapshotService} from "../services/SnapshotService";
import {Limit} from "../services/KeyboardService";
import {FAILED_MERGE, MergeResult, Side, type State} from "./base/State";
import {WordFormat, WordState} from "./WordState.svelte";

export class ParagraphState implements State {
    private _words = $state<WordState[]>([])
    readonly key: number

    constructor(words: WordState[]) {
        this._words = words
        this.key = Math.random()
    }

    get words() {
        return this._words
    }

    private get last() {
        return this._words[this._words.length - 1]
    }

    private get first() {
        return this._words[0]
    }

    private set words(value: WordState[]) {
        if (value.length == 0) {
            value.push(new WordState(WordFormat.Normal, ""))
        }

        const curr = this._words
        snapshotService.push(() => this._words = curr)
        this._words = value
    }

    public crop(start: Limit | 0, end?: Limit): MergeResult {
        return this.merge(this, start, end)
    }

    private reinterpret(start: Limit | 0, end?: Limit): [Limit, Limit] {
        if (start instanceof Limit && end == undefined) {
            return [start, new Limit(start.ref, this.last.value.length)]
        } else if (start === 0 && end != undefined) {
            return [new Limit(end.ref, 0), end]
        } else if (start instanceof Limit && end instanceof Limit) {
            return [start, end]
        } else throw new Error("unhandled case")
    }

    public merge(other: Readonly<State>, start: Limit | 0, end?: Limit): MergeResult {
        [start, end] = this.reinterpret(start, end)

        if (other instanceof ParagraphState) {
            const sw = this.words[start.wordIndex]
            const ew = other.words[end.wordIndex]

            if (sw == ew) {
                if (sw.crop(start, end).length > 0) {
                    return new MergeResult(true, this.words.length)
                }
            }

            snapshotService.beginGroup()
            const updated: WordState[] = []

            for (let i = 0; i < start.wordIndex; i++)
                updated.push(this.words[i])

            if (sw.merge(ew, start, end).length > 0) {
                updated.push(sw)
            } else {
                if (sw.crop(start).length > 0) updated.push(sw)
                if (ew.crop(0, end).length > 0) updated.push(ew)
            }

            for (let i = end.wordIndex + 1; i < other.words.length; i++)
                updated.push(other.words[i])

            this.words = updated
            snapshotService.pushGroup()
            return new MergeResult(true, this.words.length)
        }

        return FAILED_MERGE
    }
}