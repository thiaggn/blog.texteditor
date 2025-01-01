import {snapshotService} from "../services/SnapshotService";
import {WordFormat, WordState} from "./WordState.svelte";
import {TextBlockState} from "./base/State";
import {Limit} from "../services/KeyboardService.svelte";
import {selectionService} from "../services/SelectionService.svelte";


export class ParagraphState extends TextBlockState {
    private _words = $state<WordState[]>([])
    private _empty = $state(false)

    constructor(words: WordState[]) {
        super()
        this._words = words
    }

    get length(): number {
        return this._words.length
    }

    get empty() {
        return this._empty
    }

    set empty(value: boolean) {
        const old = this._empty
        snapshotService.capture(() => this._empty = old)
        this._empty = value
    }

    get words() {
        return this._words
    }

    private set words(value: WordState[]) {
        if (value.length == 0) {
            value.push(new WordState(WordFormat.Normal, ""))
        }

        const curr = this._words
        snapshotService.capture(() => this._words = curr)
        this._words = value
    }

    private get last(): WordState {
        return this.words[this.words.length - 1]
    }

    public getPathToLastLeaf(): number[] {
        return [this.length-1, this.last.length];
    }

    public getPathToFirstLeaf(): number[] {
        return [0, 0];
    }

    public remove(start: Limit | 0, end?: Limit): number {
        if (start == 0 && end) {
            start = end.copy()
            start.wordIndex = 0
            start.offset = 0

        } else if (start instanceof Limit && end == undefined) {
            end = start.copy()
            end.wordIndex = this.length - 1
            end.offset = this.last.length
        } else throw new Error()

        return this.merge(this, start, end)
    }

    private before(i: number): number {
        if (i == 0) return 0
        else return i - 1
    }

    private after(i: number): number {
        if (i < this.length) return i + 1
        else return i
    }

    private didSoftRemove(start: Limit, end: Limit): boolean {
        this.checkForNegativeOffset(start, end)
        const w = this.words[start.wordIndex]

        if (w.empty) {
            const startIndex = this.before(start.wordIndex)
            const endIndex = this.after(start.wordIndex)

            const sw = this.words[startIndex]
            const ew = this.words[endIndex]

            console.log(sw, ew)

            start.key = sw.key
            start.wordIndex = startIndex
            start.offset = 0

            end.key = ew.key
            end.wordIndex = endIndex
            end.offset = ew.length

            return false
        }

        if (w.remove(start.offset, end.offset) == 0) {
            w.empty = true
        }

        selectionService.applyCollapsed(start.key, start.offset)
        return true
    }

    public checkForNegativeOffset(start: Limit, end: Limit) {
        if (start.offset < 0 && start.wordIndex == end.wordIndex) {
            let index = start.wordIndex - 1
            let word = this.words[index]

            start.key = word.key
            start.wordIndex = index
            start.offset = word.length - 1

            end.key = word.key
            end.wordIndex = index
            end.offset = word.length
        }
    }

    public merge(other: TextBlockState, start: Limit, end: Limit): number {
        if (other instanceof ParagraphState) {

            if (start.key == end.key && this.didSoftRemove(start, end)) {
                return this.words.length
            }

            let sw = this.words[start.wordIndex]
            let ew = other.words[end.wordIndex]

            let updated: WordState[] = []

            for (let i = 0; i < start.wordIndex; i++)
                updated.push(this.words[i])

            if (sw.merge(ew, start.offset, end.offset) > 0) {
                updated.push(sw)
            } else {
                if (sw.remove(start.offset) > 0) updated.push(sw)
                if (ew.remove(0, end.offset) > 0) updated.push(ew)
            }

            for (let i = end.wordIndex + 1; i < other.words.length; i++)
                updated.push(other.words[i])

            this.words = updated
            return this.words.length
        }

        return 0
    }
}