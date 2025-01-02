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

    set blocks(value: IBlockState[]) {
        const old = this._blocks.slice()
        snapshotService.capture(() => this._blocks = old)
        this._blocks = value
    }

    public cut(start: Limit, end: Limit) {
        let {blockIndex: sb_idx, offset: sb_off} = start
        let {blockIndex: eb_idx, offset: eb_off} = end

        const sb = this.blocks[sb_idx]
        const eb = this.blocks[eb_idx]
        const del_count = eb_idx - sb_idx + 1

        if (sb instanceof TextBlockState && eb instanceof TextBlockState) {
            if (sb_idx == eb_idx) {
                sb.cut(start, end)
                return
            }

            sb.cut(start)
            eb.cut(0, end)

            if (sb.concat(eb).success) {
                this.blocks.splice(sb_idx, del_count, sb)
            }
            else if (sb.length > 0 && eb.length > 0) {
                // ok, já está atualizado
            }
            else if (sb.length > 0) {
                this.blocks.splice(sb_idx, del_count, sb)
            }
            else if (eb.length > 0) {
                this.blocks.splice(sb_idx, del_count, eb)
            }
            else {
                this.blocks.splice(sb_idx, del_count)
            }
        }
    }
}

export const editorState = $state(
    new EditorState("Bem vindo ao editor", BLOCKS_PLACEHOLDER))