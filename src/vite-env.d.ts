/// <reference types="svelte" />
/// <reference types="vite/client" />


import type {
    TextChangeDetails,
    TextDeleteDetails,
} from "./lib/actions/textevents";

import type {BoundaryRequest} from "./lib/actions/blockevents.svelte";

declare global {

    export interface HTMLElementEventMap {
        "textchange": CustomEvent<TextChangeDetails>
        "textdelete": TextDeleteDetails
        "boundaryrequest": CustomEvent<BoundaryRequest>
    }
}