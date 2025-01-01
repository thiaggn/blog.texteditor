import {snapshotService} from "../services/SnapshotService";
import {BLOCKS_PLACEHOLDER} from "../placeholder/blocks";
import {type IBlockState, TextBlockState} from "./base/State";
import {Limit} from "../services/KeyboardService.svelte.js";

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

    private willMergeWithPredBlock(start: Limit, end: Limit): boolean {
        let willMerge = start.key == end.key && start.offset < 0

        if (willMerge) {
            if (start.blockIndex > 0) {
                const pb = this.blocks[end.blockIndex-1]
                const pl = new Limit([end.blockIndex-1, ...pb.getPathToLastLeaf()], pb.key)

                const eb = this.blocks[end.blockIndex]
                const el = new Limit([end.blockIndex, ...eb.getPathToFirstLeaf()], eb.key)

                this.crop(pl, el)
            }
        }
        return willMerge
    }

    public crop(start: Limit, end: Limit) {

        let sb = this.blocks[start.blockIndex]
        let eb = this.blocks[end.blockIndex]

        if (this.willMergeWithPredBlock(start, end)) {
            return
        }

        if (sb instanceof TextBlockState && eb instanceof TextBlockState) {
            const updated: IBlockState[] = []

            for (let i = 0; i < start.blockIndex; i++)
                updated.push(this.blocks[i])

            if (sb.merge(eb, start, end) > 0) {
                updated.push(sb)
            } else {
                if (sb.remove(start) > 0) updated.push(sb)
                if (eb.remove(0, end) > 0) {
                    updated.push(eb)
                }
            }

            for (let i = end.blockIndex + 1; i < this.blocks.length; i++)
                updated.push(this.blocks[i])

            this.blocks = updated
            return this.blocks.length
        }

        return 0
    }
}

export const editorState = $state(new EditorState("Bem vindo ao editor", BLOCKS_PLACEHOLDER))