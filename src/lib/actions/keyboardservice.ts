import {keyboardService} from "../services/KeyboardService";

export function keyboardservice(node: Node) {
    keyboardService.listen()

    return {
        destroy: function () {
            keyboardService.stop()
        }
    }
}