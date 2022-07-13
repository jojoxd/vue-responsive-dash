import {inject, onBeforeUnmount, watch, readonly} from "vue-demi";
import type { Ref } from "vue-demi";
import {DashboardItem} from "../model/DashboardItem";
import {Layout} from "../model/Layout";

/**
 * Controls the lifetime of a DashboardItem existing on Layout instances
 */
export function useLayout(injectionKey: string, dashboardItem: Ref<DashboardItem | null>)
{
    const layout = inject(injectionKey)! as Ref<Layout | null>;

    watch(dashboardItem, (newItem: DashboardItem | null, oldItem: DashboardItem | null | undefined) => {
        // @TODO: Change Layout internals so we can have a layout.has(DashboardItem)

        if(!!oldItem)
            layout.value?.removeItem(oldItem);

        if(!!newItem)
            layout.value?.addItem(newItem);
    }, { immediate: true });

    // Always remove this item on unmount
    onBeforeUnmount(() => {
        if(!!dashboardItem.value)
            layout.value?.removeItem(dashboardItem.value);
    });

    return {
        // @ts-ignore
        layout: readonly(layout),
    };
}
