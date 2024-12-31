import {textEventsService} from "../services/TextEventsService.svelte";

export function keyboardservice(node: Node) {
    textEventsService.listen()

    return {
        destroy: function () {
            textEventsService.stop()
        }
    }
}