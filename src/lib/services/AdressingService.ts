export class Address {
    indexes: number[]
    key: string

    constructor(indexes: number[], key: string) {
        this.indexes = indexes
        this.key = key
    }

    copy(): Address {
        return new Address(this.indexes.slice(), this.key)
    }

}

export class AdressingService {
    private map = new WeakMap<Node, Address>()

    constructor() {
        this.map = new WeakMap()
    }

    public set(node: Node, location: Address): void {
        this.map.set(node, location)
    }

    public remove(node: Node): void {
        this.map.delete(node)
    }

    public get(node: Node): Address | undefined {
        return this.map.get(node)
    }
}

export const locationService = new AdressingService()