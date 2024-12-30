import type {State} from "../states/base/State";
import {editorState} from "../states/base/EditorState.svelte.js";

export class Reference {
    readonly leaf: State
    public indexes: number[]
    public root: State

    constructor(to: State, indexes: number[]) {
        this.leaf = to
        this.root = to
        this.indexes = indexes
    }
}

export class ReferenceService {
    private map = new WeakMap<Node, Reference>()

    constructor() {
        this.map = new WeakMap()
    }

    public add(node: Node, ref: Reference): void {

        if (ref.indexes.length > 1) {
            const b = editorState.getBlock(ref.indexes[0])
            if (b == undefined) throw new Error("não encontrou bloco raíz")
            ref.root = b
        }

        this.map.set(node, ref)
    }

    public remove(node: Node): void {
        this.map.delete(node)
    }

    public get(node: Node): Readonly<Reference> | undefined {
        return this.map.get(node)
    }
}

export const stateService = new ReferenceService()