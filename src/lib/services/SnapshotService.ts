export type RevertFunc = () => void

class Snapshot {
    states: RevertFunc[]

    constructor(f?: RevertFunc) {
        if (f) this.states = [f]
        else this.states = []
    }

    public push(state: RevertFunc): void {
        this.states.push(state)
    }

    public revert(): void {
        for (let i = this.states.length - 1; i >= 0; i--) {
            this.states[i]()
        }
    }
}

class SnapshotService {
    private snapshots: Snapshot[]
    private activeIndex: number
    private timeout: number | undefined
    private group: Snapshot | null
    private level: number

    constructor() {
        this.snapshots = []
        this.activeIndex = 0
        this.group = null
        this.level = 0
    }

    public multiple(cb: () => void) {
        this.beginGroup()
        cb()
        this.pushGroup()
    }

    private beginGroup(): void {
        if (this.group == null) {
            this.group = new Snapshot()
        }
        this.level++
    }

    private pushGroup(): void {
        if (this.group != null) {
            if (this.level == 1) {
                this.effectivePush(this.group)
                this.group = null
            }

            this.level--
        } else throw new Error("tried to push a group before starting one")
    }

    private effectivePush(s: Snapshot) {
        if (this.activeIndex < this.snapshots.length - 1) {
            this.snapshots = this.snapshots.slice(0, this.activeIndex + 1)
        }
        this.snapshots.push(s)
        this.activeIndex = this.snapshots.length
    }

    public capture(f: RevertFunc): void {
        if (this.group == null) {
            if (this.timeout != undefined) clearTimeout(this.timeout)
            this.timeout = setTimeout(
                () => this.effectivePush(new Snapshot(f)), 300
            )
        } else {
            this.group.push(f)
        }
    }

    private revert() {
        const snapshot = this.snapshots[this.activeIndex]
        if (snapshot != null) snapshot.revert()
    }

    public forward(): void {
        if (this.activeIndex < this.snapshots.length - 1) {
            this.activeIndex++
            this.revert()
            console.log("(snapshot fwrd) max:", this.snapshots.length, "active:", this.activeIndex)
        }
    }

    public back(): void {
        if (this.activeIndex > 0) {
            this.activeIndex--
            this.revert()
            console.log("(snapshot back) max:", this.snapshots.length, "active:", this.activeIndex)
        }
    }
}

export const snapshotService = new SnapshotService()

