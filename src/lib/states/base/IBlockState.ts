import type {Limit} from "../../services/KeyboardService.svelte";
import {type IState} from "./IState";
import {Result} from "./Result";

export interface IBlockState extends IState {
    readonly key: string

    get length(): number

    concat(other: IBlockState): Result
}