import {type Limit} from "../../services/TextEventsService.svelte";
import {snapshotService} from "../../services/SnapshotService";
import {type State} from "./State";
import {BLOCKS_PLACEHOLDER} from "../../placeholder/blocks";

export class EditorState {
    private _blocks = $state<State[]>([])
    private _title = $state("Editor")

    constructor(title: string, blocks: State[]) {
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

    set blocks(value: State[]) {
        const old = this._blocks.slice()
        snapshotService.push(() => this._blocks = old)
        this._blocks = value
    }

    public crop(start: Limit, end: Limit) {
        
        const sb = this.blocks[start.blockIndex]
        const eb = this.blocks[end.blockIndex]

        if (start.blockIndex == end.blockIndex) {
            sb.crop(start, end)
            return
        }

        snapshotService.beginGroup()
        const updated: State[] = []

        for (let i = 0; i < start.blockIndex; i++)
            updated.push(this.blocks[i])

        if (sb.merge(eb, start, end).length > 0)
            updated.push(sb)

        else {
            if(sb.crop(start).length > 0) updated.push(sb)
            if(eb.crop(0, end).length > 0) updated.push(eb)
        }

        for (let i = end.blockIndex + 1; i < this.blocks.length; i++)
            updated.push(this.blocks[i])

        this.blocks = updated
        snapshotService.pushGroup()
    }
}

export const editorState = $state(new EditorState("Bem vindo ao editor", BLOCKS_PLACEHOLDER))