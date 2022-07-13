import {DashboardItem} from "../model/DashboardItem";
import {LayoutData} from "../interfaces/LayoutData";

export class LayoutRegistry
{
    protected readonly items: Map<DashboardItem, LayoutData>;

    constructor()
    {
        this.items = new Map<DashboardItem, LayoutData>();
    }

    public add(dashboardItem: DashboardItem, layoutData: LayoutData): void
    {
        this.items.set(dashboardItem, layoutData);
    }

    public getData(dashboardItem: DashboardItem): LayoutData | null
    {
        return this.items.get(dashboardItem) ?? null
    }

    public remove(dashboardItem: DashboardItem): void
    {
        this.items.delete(dashboardItem);
    }

    public has(dashboardItem: DashboardItem): boolean
    {
        return this.items.has(dashboardItem);
    }

    public find(id: string | number): DashboardItem | null
    {
        return Array.from(this.items.keys()).find(item => item.id === id) ?? null;
    }

    public each(predicate: (dashboardItem: DashboardItem) => void)
    {
        Array.from(this.items.keys()).forEach(predicate);
    }

    public map<T>(predicate: (dashboardItem: DashboardItem) => T): Array<T>
    {
        return Array.from(this.items.keys()).map<T>(predicate);
    }
}