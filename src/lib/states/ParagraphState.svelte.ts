import {snapshotService} from "../services/SnapshotService";
import {Limit} from "../services/TextEventsService.svelte";
import {FAILED_MERGE, genKey, RemovalResult, type State} from "./base/State";
import {WordFormat, WordState} from "./WordState.svelte";
import { selectionService} from "../services/SelectionService.svelte";
import {Address} from "../services/AdressingService";

export class ParagraphState implements State {
    private _words = $state<WordState[]>([])
    private _empty = $state(false)
    readonly key: string

    constructor(words: WordState[]) {
        this._words = words
        this.key = genKey()
    }

    get empty() {
        return this._empty
    }

    set empty(value: boolean) {
        const old = this._empty
        snapshotService.push(() => this._empty = old)
        this._empty = value
    }

    get words() {
        return this._words
    }

    private get last() {
        return this._words[this._words.length - 1]
    }

    private get length() {
        return this._words.length
    }

    private prev(i: number) {
        if (i == 0) return i
        return i - 1
    }

    private after(i: number) {
        if (i == this.words.length) return i
        return i + 1
    }

    private set words(value: WordState[]) {
        if (value.length == 0) {
            value.push(new WordState(WordFormat.Normal, ""))
        }

        const curr = this._words
        snapshotService.push(() => this._words = curr)
        this._words = value
    }

    public crop(start: Limit | 0, end?: Limit): RemovalResult {
        return this.merge(this, start, end)
    }

    private reinterpret(start: Limit | 0, end?: Limit): [Limit, Limit] {
        if (start instanceof Limit && end == undefined) {
            const e = new Limit(start.address.copy(), this.last.value.length)
            e.wordIndex = this.words.length - 1
            return [start, e]
        } else if (start === 0 && end != undefined) {
            const s = new Limit(end.address.copy(), 0)
            s.wordIndex = 0
            return [s, end]
        } else if (start instanceof Limit && end instanceof Limit)
            return [start, end]

        else throw new Error("unhandled case")
    }

    public merge(other: Readonly<State>, start: Limit | 0, end?: Limit): RemovalResult {
        [start, end] = this.reinterpret(start, end)

        if (other instanceof ParagraphState) {
            let sw = this.words[start.wordIndex]
            let ew = other.words[end.wordIndex]

            if (sw == ew) {
                if (!sw.empty) {
                    if (sw.crop(start, end).length == 0) {
                        sw.empty = true
                        selectionService.applyCollapsed(sw.key, 1)
                    }
                    return new RemovalResult(true, this.words.length)
                }
                // se a palavra estiver marcada para exclusão, tem que reajustar
                // os limites para excluí-la e também unir as palavras adjacentes
                else {
                    let prevWordIndex = this.prev(start.wordIndex)
                    sw = this.words[prevWordIndex]

                    let afterWordIndex = this.after(start.wordIndex)
                    ew = this.words[afterWordIndex]

                    const sloc = new Address([start.blockIndex, prevWordIndex], sw.key)
                    start = new Limit(sloc, sw.value.length-1)

                    const eloc = new Address([start.blockIndex, afterWordIndex], ew.key)
                    end = new Limit(eloc, 0)
                }
            }

            snapshotService.beginGroup()
            const updated: WordState[] = []

            for (let i = 0; i < start.wordIndex; i++)
                updated.push(this.words[i])

            // se tiver como fundir as palavras nas extremidades da seleção
            if (sw.merge(ew, start, end).length > 0) {
                updated.push(sw)
            }
            // caso contrário, recorte individualmente
            else {
                if (sw.crop(start).length > 0) updated.push(sw)
                if (ew.crop(0, end).length > 0) updated.push(ew)
            }

            for (let i = end.wordIndex + 1; i < other.words.length; i++)
                updated.push(other.words[i])

            this.words = updated
            selectionService.applyCollapsed(sw.key, 0)
            snapshotService.pushGroup()
            return new RemovalResult(true, this.words.length)
        }

        return FAILED_MERGE
    }
}