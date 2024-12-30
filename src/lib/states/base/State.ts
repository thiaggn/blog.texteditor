import type {Limit} from "../../services/KeyboardService";

export enum Side {
    Left,
    Right
}

export enum Format  {
    Title,
    Paragraph
}

let i = 0
export function genKey(): number {
    return i++
}

export class MergeResult {
    readonly length: number
    readonly compatible: boolean

    constructor(success: boolean, length: number) {
        this.length = length
        this.compatible = success
    }
}

export const FAILED_MERGE: Readonly<MergeResult> = new MergeResult(false, 0)

export interface State {
    readonly key: number

    crop(start: Limit | 0, end?: Limit): MergeResult

    merge(other: Readonly<State>, start: Limit | 0, end?: Limit): MergeResult

}
