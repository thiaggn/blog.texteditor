import {locationService} from "./AdressingService";
import {Limit, Selection} from "./TextEventsService.svelte";
import {tick} from "svelte";

export enum Mode {
    Caret,
    Range
}


class SelectionService {
    public applyCollapsed(key: string, offset: number = 0) {
        tick().then(() => {
            const el = document.getElementById(key)?.firstChild
            const s = window.getSelection()

            if (el && s) {
                s.setBaseAndExtent(
                    el, offset, el, offset
                )
            }
        })
    }

    public capture(): Selection | null {
        const s = getSelection();
        if (s == undefined) throw new Error("(text events) Failed to get selection because window didn't return one");

        let anchor = s.anchorNode
        let focus = s.focusNode
        if (!anchor || !focus) return null

        let anchorPar = anchor.parentNode;
        let anchorOff = s.anchorOffset;

        let focusPar = focus.parentNode;
        let focusOff = s.focusOffset;
        if (!anchorPar || !focusPar) return null

        if (anchorPar.compareDocumentPosition(focusPar) & Node.DOCUMENT_POSITION_FOLLOWING) {
        } else if (anchorPar === focusPar) {
            if (s.anchorOffset > s.focusOffset) {
                [anchorPar, focusPar] = [focusPar, anchorPar];
                [anchorOff, focusOff] = [focusOff, anchorOff];
            }
        } else {
            [anchorPar, focusPar] = [focusPar, anchorPar];
            [anchorOff, focusOff] = [focusOff, anchorOff];
        }

        const aIndex = locationService.get(anchorPar)
        const fIndex = locationService.get(focusPar)

        if (aIndex && fIndex) {
            let left = new Limit(aIndex, anchorOff)
            let right = new Limit(fIndex, focusOff)

            const mode = s.type == "Range" ? Mode.Range : Mode.Caret
            return new Selection(left, right, mode)
        }


        return null
    }

}

export const selectionService = new SelectionService()