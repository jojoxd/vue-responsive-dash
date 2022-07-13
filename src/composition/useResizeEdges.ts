import { computed, Ref } from "vue-demi";
import { and } from "@vueuse/core";
import {isResizeEdge, ResizeEdge} from "../utils/ResizeEdge";

/**
 * De-clutter of DashboardItem
 */
export function useResizeEdges(isLocked: Ref<boolean>, isResizable: Ref<boolean>, resizeEdges: Ref<ResizeEdge>)
{
    const top = computed<boolean>(() => {
        return isLocked.value && isResizable.value && isResizeEdge(resizeEdges.value, ResizeEdge.Top);
    });

    const bottom = computed<boolean>(() => {
        return isLocked.value && isResizable.value && isResizeEdge(resizeEdges.value, ResizeEdge.Bottom);
    });

    const left = computed<boolean>(() => {
        return isLocked.value && isResizable.value && isResizeEdge(resizeEdges.value, ResizeEdge.Left);
    });

    const right = computed<boolean>(() => {
        return isLocked.value && isResizable.value && isResizeEdge(resizeEdges.value, ResizeEdge.Right);
    });

    return {
        top,
        bottom,
        left,
        right,

        topLeft: and(top, left),
        topRight: and(top, right),

        bottomLeft: and(bottom, left),
        bottomRight: and(bottom, left),
    };
}