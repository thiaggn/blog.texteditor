import {snapshotService} from "../services/SnapshotService";
import {BLOCKS_PLACEHOLDER} from "../placeholder/blocks";
import {Limit} from "../services/KeyboardService.svelte.js";
import type {IBlockState} from "./base/IBlockState";
import {TextBlockState} from "./base/TextBlockState";

export class EditorState {
    private _blocks = $state<IBlockState[]>([])
    private _title = $state("Editor")

    constructor(title: string, blocks: IBlockState[]) {
        this._blocks = blocks
        this.title = title
    }

    get title() {
        return this._title
    }

    set title(value: string) {
        this._title = value
        document.title = `Editor | ${value}`
    }

    get blocks() {
        return this._blocks
    }

    private splice(start: number, delCount: number, ...other: IBlockState[]) {
        const old = this._blocks.slice()
        snapshotService.capture(() => this._blocks = old)
        this.blocks.splice(start, delCount, ...other)
    }

    public cut(start: Limit, end: Limit) {
        let si = start.blockIndex
        let ei = end.blockIndex

        const sb = this.blocks[si]
        const eb = this.blocks[ei]
        const del_count = ei - si + 1

        if (sb instanceof TextBlockState && eb instanceof TextBlockState) {
            if (si == ei) {

                if (sb.cut(start, end).fail && si > 0) {
                    let pre_si = si - 1
                    let pre_sb = this.blocks[pre_si]

                    if (pre_sb.concat(sb).success) {
                        this.splice(si, 1)
                    }
                }

                return
            }

            sb.cut(start)
            eb.cut(0, end)

            if (sb.concat(eb).success) {
                this.splice(si, del_count, sb)
            }
            else if (sb.length > 0 && eb.length > 0) {
                // ok, já está atualizado
            }
            else if (sb.length > 0) {
                this.splice(si, del_count, sb)
            }
            else if (eb.length > 0) {
                this.splice(si, del_count, eb)
            }
            else {
                this.splice(si, del_count)
            }
        }
    }
}

export const editorState = $state(
    new EditorState("Bem vindo ao editor", BLOCKS_PLACEHOLDER))