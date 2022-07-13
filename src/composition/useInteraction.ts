import { onMounted, onBeforeUnmount, computed, ref, watch, readonly } from "vue-demi";
import type { Ref } from "vue-demi";

import "@interactjs/actions"; //!\\ Keep Import
import "@interactjs/auto-start"; //!\\ Keep Import

import interact  from "@interactjs/interact";
import {Interactable} from "@interactjs/core/Interactable";
import {SimpleEventDispatcher} from "ste-simple-events";

import { InteractEvent, Element as InteractElement } from '@interactjs/types';

/**
 * Manages Interactions (Move & Resize) of a Dashboard Item
 */
export function useInteraction(itemRef: Ref<HTMLElement>)
{
    const instance = ref<null | Interactable>(null);

    // @TODO: Initial State
    const isDraggable = ref<boolean>(false);
    const isResizable = ref<boolean>(false);
    const isLocked = ref<boolean>(false);

    // State
    const isDragging = ref<boolean>(false);
    const isResizing = ref<boolean>(false);

    onMounted(() => {
        instance.value = interact(itemRef.value);
    });

    onBeforeUnmount(() => {
        instance.value?.unset();

        onDragStart.clear();
        onDragMove.clear();
        onDragEnd.clear();

        onResizeStart.clear();
        onResizeMove.clear();
        onResizeEnd.clear();
    });

    const onDragStart = new SimpleEventDispatcher<InteractEvent>();
    const onDragMove = new SimpleEventDispatcher<InteractEvent>();
    const onDragEnd = new SimpleEventDispatcher<InteractEvent>();

    const onResizeStart = new SimpleEventDispatcher<InteractEvent>();
    const onResizeMove = new SimpleEventDispatcher<InteractEvent>();
    const onResizeEnd = new SimpleEventDispatcher<InteractEvent>();

    const resizeHold = ref<number>();
    const moveHold = ref<number>();

    const dragAllowFrom = ref<string | boolean | InteractElement | undefined>(undefined);
    const dragIgnoreFrom = ref<string | boolean | InteractElement | undefined>(undefined);

    watch([
        isDraggable,
        isLocked,
        moveHold,
        dragAllowFrom,
        dragIgnoreFrom,
    ], () => {
        if(!isLocked.value && isDraggable.value) {
            instance.value?.draggable({
                enabled: true,
                hold: moveHold.value,
                allowFrom: dragAllowFrom.value,
                ignoreFrom: dragIgnoreFrom.value,

                listeners: {
                    start: (event: InteractEvent) => {
                        isDragging.value = true;
                        onDragStart.dispatch(event);
                    },

                    move: (event: InteractEvent) => {
                        onDragMove.dispatch(event);
                    },

                    end: (event: InteractEvent) => {
                        isDragging.value = false;
                        onDragEnd.dispatch(event);
                    },
                }
            });
        } else {
            instance.value?.draggable(false);
        }
    }, { immediate: true });

    watch([
        isResizable,
        isLocked,
        resizeHold,
    ], () => {
        if(!isLocked.value && isResizable.value) {
            instance.value?.resizable({
                enabled: true,
                hold: resizeHold.value ?? 0,

                edges: {
                    top: ".resize-top",
                    left: ".resize-left",
                    bottom: ".resize-bottom",
                    right: ".resize-right",
                },

                listeners: {
                    start: (event: any) => {
                        isResizing.value = true;
                        onResizeStart.dispatch(event);
                    },

                    move: (event: any) => {
                        onResizeMove.dispatch(event);
                    },

                    end: (event: any) => {
                        isResizing.value = false;
                        onResizeEnd.dispatch(event);
                    },
                }
            });
        } else {
            instance.value?.resizable(false);
        }
    }, { immediate: true });

    return {
        instance: readonly(instance),

        isDraggable,
        isResizable,
        isLocked,

        isDragging: readonly(isDragging),
        isResizing: readonly(isResizing),

        isResizingOrDragging: computed<boolean>(() => isDragging.value && isResizing.value && !isLocked.value),

        onDragStart: onDragStart.asEvent(),
        onDragMove: onDragMove.asEvent(),
        onDragEnd: onDragEnd.asEvent(),

        onResizeStart: onResizeStart.asEvent(),
        onResizeMove: onResizeMove.asEvent(),
        onResizeEnd: onResizeEnd.asEvent(),
    };
}