import type {IBlockState} from "./IBlockState";
import  {type Limit} from "../../services/KeyboardService.svelte";
import {genKey} from "./IState";
import {type Result} from "./Result";

export abstract class TextBlockState implements IBlockState {
    readonly key: string

    protected constructor() {
        this.key = genKey()
    }

    abstract get length(): number

    abstract concat(other: IBlockState): Result

    abstract cut(start: 0 | Limit, end?: Limit): Result
}