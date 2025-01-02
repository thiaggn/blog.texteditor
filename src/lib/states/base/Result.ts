import type {Limit} from "../../services/KeyboardService.svelte";

export class Result {
    readonly success: boolean
    readonly length: number

    constructor(succes: boolean, length: number) {
        this.success = succes
        this.length = length
    }
}
