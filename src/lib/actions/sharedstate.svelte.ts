import {Address, locationService} from "../services/AdressingService";
import type {ActionReturn} from "svelte/action";

export function sharedstate(node: Node, index: Address): ActionReturn<Address>{
    locationService.set(node, index)

    return {
        destroy: function () {
            locationService.remove(node)
        },

        update: function (index: Address) {
            locationService.set(node, index)
        }
    }
}