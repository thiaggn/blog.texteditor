import {snapshotService} from "../services/SnapshotService";
import {WordFormat, WordState} from "./WordState.svelte";
import type {IBlockState} from "./base/IBlockState";
import {TextBlockState} from "./base/TextBlockState";
import {Result} from "./base/Result";
import {Limit} from "../services/KeyboardService.svelte";
import {selection} from "../services/SelectionService.svelte";


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

    private get first(): WordState {
        return this.words[0]
    }

    public concat(other: IBlockState): Result {
        if (other instanceof ParagraphState) {
            const sw = this.last
            const ew = other.first

            if (sw.concat(ew).success) {
                for(let i = 1; i < other.length; i++) {
                    this.words.push(other.words[i])
                }
            }
            else this.words.concat(other.words)
        }

        return new Result(false, 0)
    }

    private _cut(start: Limit, end: Limit): Result {
        let sw_idx = start.wordIndex
        let sw_off = start.offset
        let ew_idx = end.wordIndex
        let ew_off = end.offset

        // caso 1: o corte é dentro da mesma palavra
        if (sw_idx == ew_idx && start.blockIndex == end.blockIndex) {
            // tratamento: offset negativo
            if (sw_off < 0) {
                if (sw_idx > 0) {
                    sw_idx = sw_idx - 1
                    ew_idx = sw_idx
                    ew_off = this.words[sw_idx].length
                    sw_off = ew_off - 1
                } else throw new Error()
            }
            let sw = this.words[sw_idx]

            // caso 1.1: deletar definitivamente a palavra (continua no caso 2)
            if (sw.empty) {
                sw_idx = sw_idx > 0           ? sw_idx - 1 : 0
                ew_idx = ew_idx < this.length ? ew_idx + 1 : this.length
                sw_off = this.words[sw_idx].length
                ew_off = 0
            }
            // caso 1.2: marcar a palavra para soft delete
            else {
                if (sw.cut(sw_off, ew_off).length == 0) {
                    sw.empty = true
                    selection.collapse(sw.key, sw_off+1)
                }
                else selection.collapse(sw.key, sw_off)

                return new Result(true, this.length)
            }
        }

        // caso 2: o corte é entre palavras distintas
        const sw = this.words[sw_idx]
        const ew = this.words[ew_idx]
        const del_count = ew_idx - sw_idx + 1

        sw.cut(sw_off)
        ew.cut(0, ew_off)

        if(sw.concat(ew).success) {
            // se concatenou, então perdeu 1 word e precisa remontar o array
            this.words.splice(sw_idx, del_count, sw)
        }
        else if (sw.length > 0 && ew.length > 0) {
            // mas se não concatenou e as 2 words tem letras, já estão atualizadas.
        }
        else if (sw.length > 0) {
            this.words.splice(sw_idx, del_count, sw)
        }
        else if (ew.length > 0) {
            this.words.splice(sw_idx, del_count, ew)
        }
        else {
            // as duas palavras foram removidas
            this.words.splice(sw_idx, del_count)
        }

        selection.collapse(sw.key, sw_off)
        return new Result(true, this.length)
    }

    public cut(start: 0 | Limit, end?: Limit): Result {
        if (start != 0 && end) {
            // ok
        }
        else if (start == 0 && end) {
            start = new Limit([end.blockIndex, 0, 0], end.key)
        }
        else if (start != 0 && end == undefined) {
            end = new Limit([start.blockIndex, this.length-1, this.last.length], start.key)
        }
        else throw new Error()

        return this._cut(start, end)
    }
}