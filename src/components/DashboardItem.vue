<template>
  <div
    :id="'item_' + id"
    ref="itemElement"
    class="item"
    :style="cssStyle"
    :class="itemClasses"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <!-- Resize Top Div -->
    <div
      :id="id + '-resizeTop'"
      :ref="id + '-resizeTop'"
      class="resize resize-top"
      :style="{
        height: resizeHandleSize + 'px',
        top: -(resizeHandleSize / 2) + 'px',
        left: 0,
        right: 0,
        cursor: 'ns-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeTop"
    >
      <slot name="resizeTop"></slot>
    </div>
    <!-- Resize Bottom Div -->
    <div
      :id="id + '-resizeBottom'"
      :ref="id + '-resizeBottom'"
      class="resize resize-bottom"
      :style="{
        height: resizeHandleSize + 'px',
        left: 0 + 'px',
        right: 0 + 'px',
        bottom: -(resizeHandleSize / 2) + 'px',
        cursor: 'ns-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeBottom"
    >
      <slot name="resizeBottom"></slot>
    </div>
    <!-- Resize Left Div -->
    <div
      :id="id + '-resizeLeft'"
      :ref="id + '-resizeLeft'"
      class="resize resize-left"
      :style="{
        width: resizeHandleSize + 'px',
        top: 0 + 'px',
        bottom: 0 + 'px',
        left: -(resizeHandleSize / 2) + 'px',
        cursor: 'ew-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeLeft"
    >
      <slot name="resizeLeft"></slot>
    </div>
    <!-- Resize Right Div -->
    <div
      :id="id + '-resizeRight'"
      :ref="id + '-resizeRight'"
      class="resize resize-right"
      :style="{
        width: resizeHandleSize + 'px',
        top: 0 + 'px',
        bottom: 0 + 'px',
        right: -(resizeHandleSize / 2) + 'px',
        cursor: 'ew-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeRight"
    >
      <slot name="resizeRight"></slot>
    </div>
    <!-- Resize Top Left Div -->
    <div
      :id="id + '-resizeTopLeft'"
      :ref="id + '-resizeTopLeft'"
      class="resize resize-left resize-top"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        top: -resizeHandleSize + 'px',
        left: -resizeHandleSize + 'px',
        cursor: 'nw-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeTopLeft"
    >
      <slot name="resizeTopLeft"></slot>
    </div>
    <!-- Top Right Resize Div -->
    <div
      :id="id + '-resizeTopRight'"
      :ref="id + '-resizeTopRight'"
      class="resize resize-right resize-top"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        top: -resizeHandleSize + 'px',
        right: -resizeHandleSize + 'px',
        cursor: 'ne-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeTopRight"
    >
      <slot name="resizeTopRight"></slot>
    </div>
    <!-- Bottom Left Resize Div -->
    <div
      :id="id + '-resizeBottomLeft'"
      :ref="id + '-resizeBottomLeft'"
      class="resize resize-left resize-bottom"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        bottom: -resizeHandleSize + 'px',
        left: -resizeHandleSize + 'px',
        cursor: 'ne-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeBottomLeft"
    >
      <slot name="resizeBottomLeft"></slot>
    </div>
    <!-- Bottom Right Resize Div -->
    <div
      :id="id + '-resizeBottomRight'"
      :ref="id + '-resizeBottomRight'"
      class="resize resize-right resize-bottom"
      :style="{
        width: resizeHandleSize * 2 + 'px',
        height: resizeHandleSize * 2 + 'px',
        bottom: -resizeHandleSize + 'px',
        right: -resizeHandleSize + 'px',
        cursor: 'nw-resize',
        position: 'absolute',
        zIndex: resizableZIndex,
      }"
      v-if="resizeBottomRight"
    >
      <slot name="resizeBottomRight"></slot>
    </div>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { provide, watch, onMounted, ref, computed, toRef, toRefs, PropType } from "vue-demi";
  import {DashboardItem} from "../model/DashboardItem";
  import {useVModels} from "@vueuse/core";
  import { useInteraction } from "../composition/useInteraction";
  import {useLayout} from "../composition/useLayout";
  import {useResizeEdges} from "../composition/useResizeEdges";
  import {DashboardItemDefaults, LayoutDefaults} from "../model/defaults";
  import {ResizeEdge} from "../utils/ResizeEdge";

  const dashboardItem = ref<DashboardItem | null>(null);
  const hover = ref<boolean>(false);

  // Auto-populated by Vue
  const itemElement = ref<HTMLDivElement>();

  // @TODO: May not need any processing, could maybe just use inject("$layout")
  const layout = useLayout("$layout", dashboardItem);

  const props = defineProps({
    id: {
      type: [Number, String],
      required: true,
    },

    x: {
      type: Number,
      default: DashboardItemDefaults.x,
    },

    y: {
      type: Number,
      default: DashboardItemDefaults.y,
    },

    width: {
      type: Number,
      default: DashboardItemDefaults.width,
    },

    maxWidth: {
      type: [Number, Boolean] as PropType<number | false>,
      default: DashboardItemDefaults.maxWidth,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    minWidth: {
      type: [Number, Boolean] as PropType<number | false>,
      default: DashboardItemDefaults.minWidth,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    height: {
      type: Number,
      default: DashboardItemDefaults.height,
    },

    maxHeight: {
      type: [Number, Boolean] as PropType<number | false>,
      default: DashboardItemDefaults.maxHeight,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    minHeight: {
      type: [Number, Boolean] as PropType<number | false>,
      default: DashboardItemDefaults.minHeight,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    draggable: {
      type: Boolean,
      default: DashboardItemDefaults.draggable,
    },

    resizable: {
      type: Boolean,
      default: DashboardItemDefaults.resizable,
    },

    resizeEdges: {
      type: Number as PropType<ResizeEdge>,
      default: DashboardItemDefaults.resizeEdges,
    },

    resizeHandleSize: {
      type: Number,
      default: DashboardItemDefaults.resizeHandleSize,
    },

    moveHold: {
      type: Number,
      default: DashboardItemDefaults.moveHold,
    },

    resizeHold: {
      type: Number,
      default: DashboardItemDefaults.resizeHold,
    },

    dragAllowFrom: {
      type: String,
      default: DashboardItemDefaults.dragAllowFrom,
    },

    dragIgnoreFrom: {
      type: String,
      default: DashboardItemDefaults.dragIgnoreFrom,
    },

    locked: {
      type: Boolean,
      default: DashboardItemDefaults.locked,
    },
  });

  const emit = defineEmits([
    'update:x',
    'update:y',
    'update:width',
    'update:height',

    'dragStart',
    'dragMove',
    'dragEnd',

    'resizeStart',
    'resizeMove',
    'resizeEnd',

    'hoverStart',
    'hoverEnd',
  ]);

  const { x, y, width, height } = useVModels(props, emit);

  // Computed
  const itemClasses = computed(() => {
    return {
      dragging: resizingOrDragging.value,
      cssTransforms: useCssTransforms.value,
    };
  });

  const useCssTransforms = computed(() => {
    if (layout.value) {
      return layout.value.useCssTransforms;
    }

    return LayoutDefaults.useCssTransforms;
  });

  const left = computed(() => {
    return dashboardItem.value?.left ?? 0;
  });

  const top = computed(() => {
    return dashboardItem.value?.top ?? 0;
  });

  const widthPx = computed(() => {
    return dashboardItem.value?.widthPx ?? 0;
  });

  const heightPx = computed(() => {
    return dashboardItem.value?.heightPx ?? 0;
  });

  const cssStyle = computed(() => {
    if (useCssTransforms.value) {
      return DashboardItem.cssTransform(
          top.value,
          left.value,
          widthPx.value,
          heightPx.value
      );
    } else {
      return DashboardItem.cssTopLeft(
          top.value,
          left.value,
          widthPx.value,
          heightPx.value
      );
    }
  });

  provide("$item", dashboardItem);

  watch(props, () => {
    // @TODO: This will needlessly update dashboard, would be better if we intern Dashboard using refs / watches

    if(dashboardItem.value) {
      dashboardItem.value.id = props.id;
      dashboardItem.value.x = props.x;
      dashboardItem.value.y = props.y;
      dashboardItem.value.width = props.width;
      dashboardItem.value.maxWidth = props.maxWidth;
      dashboardItem.value.minWidth = props.minWidth;
      dashboardItem.value.height = props.height;
      dashboardItem.value.maxHeight = props.maxHeight;
      dashboardItem.value.minHeight = props.minHeight;
      dashboardItem.value.draggable = props.draggable;
      dashboardItem.value.resizable = props.resizable;
      dashboardItem.value.resizeEdges = props.resizeEdges;
      dashboardItem.value.resizeHandleSize = props.resizeHandleSize;
      dashboardItem.value.draggableZIndex = props.draggableZIndex;
      dashboardItem.value.resizableZIndex = props.resizableZIndex;
      dashboardItem.value.moveHold = props.moveHold;
      dashboardItem.value.resizeHold = props.resizeHold;
      dashboardItem.value.dragAllowFrom = props.dragAllowFrom;
      dashboardItem.value.dragIgnoreFrom = props.dragIgnoreFrom;
      dashboardItem.value.locked = props.locked;
    }
  }, { deep: true });

  // watches
  watch(hover, (isHovering) => {
    dashboardItem.hover = isHovering;

    if (isHovering) {
      emit("hoverStart", dashboardItem.value);
    } else {
      emit("hoverEnd", dashboardItem.value);
    }
  });

  const {
    instance: interactInstance,
    isDraggable: draggable,
    isResizable: resizable,
    isLocked: locked,

    isResizingOrDragging: resizingOrDragging,

    onDragStart,
    onDragMove,
    onDragEnd,
    isDragging,

    onResizeStart,
    onResizeMove,
    onResizeEnd,
    isResizing,
  } = useInteraction(itemElement);

  onDragStart.subscribe((event) => {
    dashboardItem.value?._onMoveStart();
    emit("dragStart", { ...dashboardItem.value?.toItem() });
  });

  onDragMove.subscribe((event) => {
    // @TODO: Is this if statement needed? won't this always be true?
    if(isDragging.value) {
      dashboardItem.value?._onMove(event.dx, event.dy);
      emit("dragMove", { ...dashboardItem.value?.toItem() });
    }
  });

  onDragEnd.subscribe((event) => {
    dashboardItem.value?._onMoveEnd();
    emit("dragEnd", { ...dashboardItem.value?.toItem() });
  });

  onResizeStart.subscribe((event) => {
    dashboardItem.value?._onResizeStart();
    emit("resizeStart", { ...dashboardItem.value?.toItem() });
  });

  onResizeMove.subscribe((event) => {
    // @TODO: Is this if statement needed? won't this always be true?
    if(isResizing.value) {
      dashboardItem.value?._onResize(event);
      emit("resizeMove", { ...dashboardItem.value?.toItem() });
    }
  });

  onResizeEnd.subscribe((event) => {
    dashboardItem.value?._onResizeEnd();
    emit("resizeEnd", { ...dashboardItem.value?.toItem() });
  });

  const {
    top: resizeTop,
    bottom: resizeBottom,
    left: resizeLeft,
    right: resizeRight,

    topLeft: resizeTopLeft,
    topRight: resizeTopRight,

    bottomLeft: resizeBottomLeft,
    bottomRight: resizeBottomRight,
  } = useResizeEdges(locked, resizable, toRef(props.resizeEdges));

  onMounted(() => {
    dashboardItem.value = new DashboardItem({ ...props });
  });
</script>

<style scoped>
  .item {
    box-sizing: border-box;
    position: absolute;
    display: inline-block;
    transition: all 200ms ease;
    transition-property: left, top, right;
    touch-action: none;
    user-select: none;
  }
  .item.dragging {
    transition: none;
    z-index: 3;
  }

  .resize {
    touch-action: none;
    user-select: none;
  }

  .item.cssTransforms {
    transition-property: transform;
    left: 0;
    right: auto;
  }
</style>
