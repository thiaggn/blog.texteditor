import {Address} from "./AdressingService";
import {snapshotService} from "./SnapshotService";
import {editorState} from "../states/EditorState.svelte.js";
import {Mode, selectionService} from "./SelectionService.svelte";

enum Direction {
    Left,
    Right
}

export class Limit {
    public indexes: number[]
    public key: string

    constructor(indexes: number[], key: string) {
        this.indexes = indexes
        this.key = key
    }

    public copy() {
        return new Limit([...this.indexes], this.key)
    }

    get blockIndex() {
        return this.indexes[0]
    }

    set blockIndex(value: number) {
        this.indexes[0] = value
    }

    get wordIndex() {
        return this.indexes[1]
    }

    set wordIndex(value: number) {
        this.indexes[1] = value
    }

    get offset() {
        return this.indexes[this.indexes.length - 1]
    }

    set offset(value: number) {
        this.indexes[this.indexes.length - 1] = value
    }
}

export class Selection {
    left: Limit
    right: Limit
    mode: Mode

    constructor(l: Limit, r: Limit, mode: Mode) {
        this.left = l
        this.right = r
        this.mode = mode
    }

    public moveOffset(dir: Direction): void {
        this.left.offset += dir == Direction.Left ? -1 : 0
        this.right.offset += dir == Direction.Right ? +1 : 0
    }
}

class KeyboardService {
    private evlistener: (ev: KeyboardEvent) => void

    constructor() {
        this.evlistener = this.handleKeyEvent.bind(this)
    }

    private async handleRemoval(sel: Selection, dir: Direction) {
        snapshotService.multiple(() => {
            if (sel.mode == Mode.Caret) sel.moveOffset(dir)
            editorState.crop(sel.left, sel.right)
        })
    }

    private async handleKeyEvent(ev: KeyboardEvent): Promise<void> {
        const sel = selectionService.capture()
        let key = ev.key.toLowerCase()

        if (ev.ctrlKey) {
            if (key == "z") {
                ev.preventDefault()
                snapshotService.back()

            } else if (key == "y") {
                ev.preventDefault()
                snapshotService.forward()
            }
        }

        if (sel != null) {
            switch (key) {
                case "backspace":
                    ev.preventDefault()
                    await this.handleRemoval(sel, Direction.Left)
                    break

                case "delete":
                    ev.preventDefault()
                    await this.handleRemoval(sel, Direction.Right)
                    break

                case "enter":
                    ev.preventDefault()
                    break
            }

            if (ev.ctrlKey) {
                ev.preventDefault()

                switch (key) {
                    case "b":
                        break

                    case "i":
                        break

                    case "u":
                        break
                }
            }
        }
    }

    public listen(): void {
        this.evlistener = this.handleKeyEvent.bind(this)
        document.addEventListener("keydown", this.evlistener)
    }

    public stop(): void {
        document.removeEventListener("keydown", this.evlistener)
    }
}

export const textEventsService = new KeyboardService()
