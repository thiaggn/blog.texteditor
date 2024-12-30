import {type Reference, stateService} from "../services/ReferenceService";

export function sharedstate(node: Node, ref: Reference) {
    stateService.add(node, ref)


    return {
        destroy: function () {
            stateService.remove(node)
        }
    }
}