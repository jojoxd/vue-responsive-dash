import { watchEffect, onBeforeUnmount, inject, Ref, readonly } from "vue-demi";
import {Layout} from "../model/Layout";
import {Dashboard} from "../model/Dashboard";

export function useDashboard(injectionKey: string, layout: Ref<Layout | null>)
{
    const dashboard = inject(injectionKey)! as Ref<Dashboard | null>;

    watchEffect(() => {
        if(!!layout.value)
            dashboard.value?.addLayoutInstance(layout.value);
    });

    onBeforeUnmount(() => {
        if(!!layout.value)
            dashboard?.value?.removeLayoutInstance(layout.value);
    });

    return {
        // @ts-ignore Dashboard could be undefined here, let's assume it's not
        dashboard: readonly(dashboard),
    };
}
