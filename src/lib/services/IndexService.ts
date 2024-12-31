export class IndexService {
    private map = new WeakMap<Node, number[]>()

    constructor() {
        this.map = new WeakMap()
    }

    public set(node: Node, indexes: number[]): void {
        this.map.set(node, indexes)
    }

    public remove(node: Node): void {
        this.map.delete(node)
    }

    public get(node: Node): number[] | undefined {
        return this.map.get(node)
    }
}

export const indexService = new IndexService()