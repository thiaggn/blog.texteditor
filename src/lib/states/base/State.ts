import type {Limit} from "../../services/TextEventsService.svelte";


export function genKey() {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let resultado = '';
    for (let i = 0; i < 8; i++) {
        const indiceAleatorio = Math.floor(Math.random() * caracteres.length);
        resultado += caracteres[indiceAleatorio];
    }
    return resultado;
}

export class RemovalResult {
    readonly length: number
    readonly merged: boolean

    constructor(success: boolean, length: number) {
        this.length = length
        this.merged = success
    }
}

export const FAILED_MERGE: Readonly<RemovalResult> = new RemovalResult(false, 0)

export interface State {
    readonly key: string

    empty: boolean

    crop(start: Limit | 0, end?: Limit): RemovalResult

    merge(other: Readonly<State>, start: Limit | 0, end?: Limit): RemovalResult

}
