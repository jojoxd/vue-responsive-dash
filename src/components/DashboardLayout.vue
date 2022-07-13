<template>
  <div v-if="currentBreakpoint === breakpoint">
    <div
      v-if="l"
      :style="{ position: 'relative', height: height, width: width }"
    >
      <slot></slot>
      <Dashboard-Item
        :id="placeholderId"
        :draggable="false"
        :resizable="false"
        v-show="dragging || resizing"
        :y.sync="placeholderY"
        :height.sync="placeholderHeight"
        :maxWidth.sync="placeholderMaxWidth"
      >
        <slot name="placeholder">
          <div class="placeholder"></div>
        </slot>
      </Dashboard-Item>
    </div>
    <div v-if="debug">
      Layout Breakpoint: {{ breakpoint }} <br />
      Layout Number of Cols: {{ numberOfCols }} <br />
      placeholder: {{ JSON.stringify(placeholder) }} <br />
      Items: {{ JSON.stringify(itemsFromLayout) }} <br />
      Height: {{ height }} <br />
    </div>
  </div>
</template>

<script setup lang="ts">
  import DashboardItem from "./DashboardItem";
  import {onMounted, provide, ref, defineProps, toRefs, computed, watch} from "vue-demi";
  import {Layout} from "../model/Layout";
  import {useDashboard} from "../composition/useDashboard";
  import {LayoutDefaults} from "../model/defaults";

  const props = defineProps({
    breakpoint: {
      type: String,
      required: true
    },

    breakpointWidth: {
      type: Number,
      default: LayoutDefaults.breakpointWidth
    },

    numberOfCols: {
      type: Number,
      default: LayoutDefaults.numberOfCols
    },

    useCssTransforms: {
      type: Boolean,
      default: LayoutDefaults.useCssTransforms,
    },

    compact: {
      type: Boolean,
      default: LayoutDefaults.compact
    },

    margin: {
      type: Object,
      default: () => ({ x: LayoutDefaults.marginX, y: LayoutDefaults.marginY })
    },

    rowHeight: {
      type: [Number, Boolean] as PropType<number | false>,
      default: LayoutDefaults.rowHeight,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    maxRowHeight: {
      type: [Number, Boolean] as PropType<number | false>,
      default: LayoutDefaults.maxRowHeight,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    minRowHeight: {
      type: [Number, Boolean] as PropType<number | false>,
      default: LayoutDefaults.minRowHeight,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    colWidth: {
      type: [Number, Boolean] as PropType<number | false>,
      default: LayoutDefaults.colWidth,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    maxColWidth: {
      type: [Number, Boolean] as PropType<number | false>,
      default: LayoutDefaults.maxColWidth,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    minColWidth: {
      type: [Number, Boolean] as PropType<number | false>,
      default: LayoutDefaults.minColWidth,
      validate: (value) => typeof value === "number" || (typeof value === "boolean" && !value),
    },

    initialItems: {
      type: Array,
      default: () => [],
    }
  });

  const l = ref<Layout>(null);
  provide("$layout", l);

  const { dashboard } = useDashboard("$dashboard", l);

  const placeholderId = ref("-1Placeholder");
  const placeholderY = ref(0);
  const placeholderHeight = ref(0);
  const placeholderMaxWidth = ref(false);

  onMounted(() => {
    l.value = new Layout({ ...props });
  });

  const currentBreakpoint = computed(() => {
    return dashboard.value?.currentBreakpoint ?? "";
  });

  const dragging = computed(() => {
    return l.value?.itemBeingDragged;
  });

  const resizing = computed(() => {
    return l.value?.itemBeingResized;
  });

  const placeholder = computed(() => {
    // @TODO: WARN: Typing is incompatible, this came from source
    return l.value?.placeholder?.toItem() ?? "";
  });

  const itemsFromLayout = computed(() => {
    return l.value?.items ?? [];
  });

  // TODO: Can height be null? could be false too? came from source
  const height = computed(() => {
    return `${l.value?.height ?? "0"}px`;
  });

  // TODO: Can width be null? could be false too? came from source
  const width = computed(() => {
    return `${l.value?.width ?? "0"}px`;
  });

  watch(props, () => {
    // @TODO: This will needlessly update layout, would be better if we intern Layout using refs / watches

    if(l.value) {
      l.value.breakpoint = props.breakpoint;
      l.value.breakpointWidth = props.breakpointWidth;
      l.value.numberOfCols = props.numberOfCols;
      l.value.useCssTransforms = props.useCssTransforms;
      l.value.compact = props.compact;
      l.value.margin = props.margin;
      l.value.rowHeight = props.rowHeight;
      l.value.maxRowHeight = props.maxRowHeight;
      l.value.minRowHeight = props.minRowHeight;
      l.value.colWidth = props.colWidth;
      l.value.maxColWidth = props.maxColWidth;
      l.value.minColWidth = props.minColWidth;
    }
  });
</script>

<script lang="ts">
  export default {
    name: "DashboardLayout",
    inheritAttrs: false
  };
</script>

<style scoped>
  .placeholder {
    height: 100%;
    width: 100%;
    background-color: red;
    opacity: 0.2;
  }
</style>
