<template>
  <div :id="id" :ref="id" v-if="d" v-resize-detector @resize="onResize">
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
  import { resize as vResizeDetector } from "vue-element-resize-detector";
  import { provide, computed, watch, defineProps, onMounted, ref } from "vue-demi";
  import {Dashboard} from "../model/Dashboard";
  import {LayoutDefaults} from "../model/defaults";

  const props = defineProps({
    id: {
      type: Object as PropType<number | string>,
      required: true
    },

    autoHeight: {
      type: Boolean,
      default: LayoutDefaults.autoHeight
    },
  });

  const emit = defineEmits([
      'currentBreakpointUpdated'
  ]);

  const d = ref(null);

  onMounted(() => {
    d.value = new Dashboard(props);
  });

  provide("$dashboard", d);

  const currentBreakpoint = computed(() => {
    return d.value?.currentBreakpoint ?? null;
  });

  watch(currentBreakpoint, (newValue) => {
    if (newValue) {
      emit("currentBreakpointUpdated", newValue);
    }
  });

  function onResize(e) {
    if(d.value)
      d.value.width = e.detail.width;
  }

  // function createPropWatchers() {
  //   //Setup prop watches to sync with the Dash Item
  //   Object.keys(props).forEach((key) => {
  //     this.$watch(key, watchProp(key, true));
  //   });
  // }

</script>

<script lang="ts">
  export default {
    name: "Dashboard",
  }
</script>

<style></style>
