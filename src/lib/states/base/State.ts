import type {Limit} from "../../services/KeyboardService.svelte.js";

export function genKey() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 8; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[indiceAleatorio];
    }
    return resultado;
}

export interface IState {
    readonly key: string
}

export interface IBlockState extends IState {
    readonly key: string
    merge(other: IBlockState, start: Limit, end: Limit): number
    getPathToLastLeaf(): number[]
    getPathToFirstLeaf(): number[]
}

export abstract class TextBlockState implements IBlockState {
    readonly key: string

    protected constructor() {
        this.key = genKey()
    }

    abstract get length(): number
    abstract remove(start: Limit | 0, end?: Limit): number
    abstract merge(other: TextBlockState, start: Limit, end: Limit): number
    abstract getPathToLastLeaf(): number[]
    abstract getPathToFirstLeaf(): number[]
}