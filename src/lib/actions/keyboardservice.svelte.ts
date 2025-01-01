import {textEventsService} from "../services/KeyboardService.svelte.js";

export function keyboardservice(node: Node) {
    textEventsService.listen()

    return {
        destroy: function () {
            textEventsService.stop()
        }
    }
}