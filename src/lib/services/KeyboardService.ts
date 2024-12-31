import {indexService} from "./IndexService";

import {snapshotService} from "./SnapshotService";
import {StringState} from "../states/base/StringState.svelte";
import {editorState} from "../states/base/EditorState.svelte.js";
import type {State} from "../states/base/State";

enum Mode {
    Caret,
    Range
}

enum Direction {
    Left,
    Right
}


export class Limit {
    public indexes: number[]
    public offset: number

    constructor(indexes: number[], offset: number) {
        this.indexes = indexes
        this.offset = offset
    }

    get blockIndex() {
        return this.indexes[0]
    }

    get wordIndex() {
        return this.indexes[1]
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

    get current(): Limit {
        return this.left
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

    private getSelection(): Selection | null {
        const s = getSelection();
        if (s == undefined) throw new Error("(Editor) Failed to get selection because window didn't return one");

        let anchorPar = s.anchorNode?.parentNode;
        let anchorOff = s.anchorOffset;

        let focusPar = s.focusNode?.parentNode;
        let focusOff = s.focusOffset;

        if (anchorPar && focusPar) {
            if (anchorPar.compareDocumentPosition(focusPar) & Node.DOCUMENT_POSITION_FOLLOWING) {
            } else if (anchorPar === focusPar) {
                if (s.anchorOffset > s.focusOffset) {
                    [anchorPar, focusPar] = [focusPar, anchorPar];
                    [anchorOff, focusOff] = [focusOff, anchorOff];
                }
            } else {
                [anchorPar, focusPar] = [focusPar, anchorPar];
                [anchorOff, focusOff] = [focusOff, anchorOff];
            }

            const aIndexes = indexService.get(anchorPar)
            const fIndexes = indexService.get(focusPar)

            if (aIndexes && fIndexes) {
                let left = new Limit(aIndexes, anchorOff)
                let right = new Limit(fIndexes, focusOff)

                const mode = s.type == "Range" ? Mode.Range : Mode.Caret
                return new Selection(left, right, mode)
            }
        }

        return null
    }

    private handleRemoval(sel: Selection, dir: Direction) {
        if (sel.mode == Mode.Caret) {
            sel.moveOffset(dir)
            editorState.crop(sel.left, sel.right)

        } else if (sel.mode == Mode.Range) {
            editorState.crop(sel.left, sel.right)
        }
    }

    private handleKeyEvent(ev: KeyboardEvent): void {
        const sel = this.getSelection()
        let key = ev.key.toLowerCase()

        if (ev.ctrlKey) {
            if (key == "z") {
                ev.preventDefault()
                snapshotService.back()
            }
            else if (key == "y") {
                ev.preventDefault()
                snapshotService.forward()
            }
        }

        if (sel != null) {
            switch (key) {
                case "backspace":
                    ev.preventDefault()
                    this.handleRemoval(sel, Direction.Left)
                    break

                case "delete":
                    ev.preventDefault()
                    this.handleRemoval(sel, Direction.Right)
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

export const keyboardService = new KeyboardService()
