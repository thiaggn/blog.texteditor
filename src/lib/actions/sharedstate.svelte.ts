import {indexService} from "../services/IndexService";
import type {ActionReturn} from "svelte/action";

export function sharedstate(node: Node, indexes: number[]): ActionReturn<number[]>{
    indexService.set(node, indexes)

    return {
        destroy: function () {
            indexService.remove(node)
        },

        update: function (indexes: number[]) {
            indexService.set(node, indexes)
        }
    }
}