import {DashboardItem} from "./DashboardItem";
import {LayoutRegistry} from "../utils/LayoutRegistry";
import {LayoutItemUtils} from "../utils/LayoutItemUtils";
import {LayoutConstructorData} from "../interfaces/LayoutConstructorData";
import {LayoutData} from "../interfaces/LayoutData";
import {Point} from "../interfaces/types";
import {Item} from "../interfaces/Item";
import {LayoutDefaults} from "./defaults";

export class Layout
{
    // @TODO: Check typing
    protected _breakpoint: string;

    // @TODO: Check Typing
    protected _breakpointWidth: number | undefined;

    protected _margin: Point;

    protected _width: number;

    protected _height: number;

    protected _numberOfCols: number;

    protected _autoHeight: boolean;

    // @TODO: Check Typing
    protected _rowHeight: number;

    // @TODO: Check Typing
    protected _minRowHeight: number | boolean;

    // @TODO: Check Typing
    protected _maxRowHeight: number | boolean;

    // @TODO: Check Typing
    protected _colWidth: number;

    // @TODO: Check Typing
    protected _minColWidth: number | boolean;

    // @TODO: Check Typing
    protected _maxColWidth: number | boolean;

    protected _compact: boolean;

    protected _useCssTransforms: boolean;

    protected _itemBeingDragged: boolean = false;

    protected _itemBeingResized: boolean = false;

    protected _initialItemIds: Array<number | string> = [];

    protected _registry: LayoutRegistry = new LayoutRegistry();

    protected _itemUtils: LayoutItemUtils = new LayoutItemUtils(this);

    constructor(data: LayoutConstructorData)
    {
        this._breakpoint = data.breakpoint;

        this._numberOfCols = data.numberOfCols ?? LayoutDefaults.numberOfCols;

        this._breakpointWidth = data.breakpointWidth ?? LayoutDefaults.breakpointWidth;

        this._margin = data.margin ?? {
            x: LayoutDefaults.marginX,
            y: LayoutDefaults.marginY
        };

        this._autoHeight = data.autoHeight ?? LayoutDefaults.autoHeight;

        this._useCssTransforms = data.useCssTransforms ?? LayoutDefaults.useCssTransforms;

        this._width = data.width ?? LayoutDefaults.width;
        this._height = data.height ?? LayoutDefaults.height;

        this._rowHeight = data.rowHeight ?? LayoutDefaults.rowHeight;
        this._minRowHeight = data.minRowHeight ?? LayoutDefaults.minRowHeight;
        this._maxRowHeight = data.maxRowHeight ?? LayoutDefaults.maxRowHeight;

        this._colWidth = data.colWidth ?? LayoutDefaults.colWidth;
        this._minColWidth = data.minColWidth ?? LayoutDefaults.minColWidth;
        this._maxColWidth = data.maxColWidth ?? LayoutDefaults.maxColWidth;

        this._compact = data.compact ?? LayoutDefaults.compact;

        this._initialItemIds = data.initialItems?.map((item) => item.id) ?? [];
    }

    /// <editor-fold name="Getters / Setters (MAGIC)">
    get breakpoint(): string
    {
        return this._breakpoint;
    }

    set breakpoint(breakpoint: string)
    {
        this._breakpoint = breakpoint;
    }

    get breakpointWidth(): number | undefined
    {
        return this._breakpointWidth;
    }

    get margin()
    {
        return this._margin;
    }

    set margin(margin: Point)
    {
        this._margin = margin;
    }

    get width()
    {
        return this.calculateWidth();
    }

    set width(width: number)
    {
        this._width = width;
        this.updateItems();
    }

    get height()
    {
        if(this._autoHeight)
            return this.calculateHeight();

        return this._height;
    }

    set height(height: number)
    {
        // @TODO: Should we disable autoHeight here?
        this._height = height;
    }

    get numberOfCols(): number
    {
        return this._numberOfCols;
    }

    set numberOfCols(numberOfCols: number)
    {
        this._numberOfCols = numberOfCols;
        this.updateItems();
    }

    get autoHeight(): boolean
    {
        return this._autoHeight;
    }

    set autoHeight(autoHeight: boolean)
    {
        this._autoHeight = autoHeight;
    }

    get maxRowHeight(): number | boolean
    {
        return this._maxRowHeight;
    }

    set maxRowHeight(maxRowHeight: number | boolean)
    {
        this._maxRowHeight = maxRowHeight;
        this.updateItems();
    }

    get minRowHeight(): number | boolean
    {
        return this._minRowHeight;
    }

    set minRowHeight(minRowHeight: number | boolean)
    {
        this._minRowHeight = minRowHeight;
        this.updateItems();
    }

    get rowHeight(): number
    {
        let rowHeight = this._colWidth as number;

        if(typeof this._rowHeight === "number")
            rowHeight = this._rowHeight;

        // @TODO: Change to MathUtil.clamp?
        if(typeof this.maxRowHeight === "number" && rowHeight > this.maxRowHeight)
            rowHeight = this.maxRowHeight;

        if(typeof this.minRowHeight === "number" && rowHeight < this.minRowHeight)
            rowHeight = this.minRowHeight;

        return rowHeight;
    }

    set rowHeight(rowHeight: number)
    {
        this._rowHeight = rowHeight;
        this.updateItems();
    }

    get maxColWidth()
    {
        return this._maxColWidth;
    }

    set maxColWidth(maxColWidth: number | boolean)
    {
        this._maxColWidth = maxColWidth;
        this.updateItems();
    }

    get minColWidth()
    {
        return this._minColWidth;
    }

    set minColWidth(minColWidth: number | boolean)
    {
        this._minColWidth = minColWidth;
        this.updateItems();
    }

    get colWidth(): number
    {
        let colWidth = 0;

        if(typeof this._colWidth === "number") {
            colWidth = this._colWidth;
        } else {
            colWidth = (this.width - this.margin.x * (this.numberOfCols + 1)) / this.numberOfCols;
        }

        // @TODO: use MathUtils.clamp?
        if(typeof this.maxColWidth === "number" && colWidth > this.maxColWidth)
            colWidth = this.maxColWidth;

        if(typeof this.minColWidth === "number" && colWidth < this.minColWidth)
            colWidth = this.minColWidth;

        return colWidth;
    }

    set colWidth(colWidth: number)
    {
        // @TODO: Should we call updateItems() here?
        this._colWidth = colWidth;
    }

    get itemBeingDragged(): boolean
    {
        return this._itemBeingDragged;
    }

    set itemBeingDragged(itemBeingDragged: boolean)
    {
        this._itemBeingDragged = itemBeingDragged;
    }

    get itemBeingResized(): boolean
    {
        return this._itemBeingResized;
    }

    set itemBeingResized(itemBeingResized: boolean)
    {
        this._itemBeingResized = itemBeingResized;
    }

    get placeholder()
    {
        // @TODO: When is this created?
        return this.getItemById("-1Placeholder");
    }

    set placeholder(placeholder)
    {
        // @TODO: Wat, recursive, should not be here
        this.placeholder = placeholder;
    }

    get compact()
    {
        return this._compact;
    }

    set compact(compact: boolean)
    {
        // Should we call updateItems() here?
        this._compact = compact;
    }

    get useCssTransforms(): boolean
    {
        // @TODO: This should probably not be in this class?
        return this._useCssTransforms;
    }

    set useCssTransforms(useCssTransforms: boolean)
    {
        this._useCssTransforms = useCssTransforms;
    }
    /// </editor-fold>


    //used when colWidth is defined (i.e. not looking or caring about width of window )
    calculateWidth(): number
    {
        if(typeof this._colWidth === "number" && typeof this.colWidth === "number") {
            return this.numberOfCols * (this.colWidth + this.margin.x) + this.margin.x;
        }

        return this._width;
    }

    calculateHeight(): number
    {
        let maxY = 0;

        this._registry.each((dashboardItem: DashboardItem) => {
            const bottomY = dashboardItem.y + dashboardItem.height;

            if(bottomY > maxY)
                maxY = bottomY;
        });

        return maxY * (this.rowHeight + this.margin.y) + this.margin.y;
    }

    public addItem(dashboardItem: DashboardItem)
    {
        const layoutData: LayoutData = {
            unsubscribe: {
                dragStartListener: dashboardItem.onMoveStart.subscribe((item) => this.itemDragging(item)),
                dragListener: dashboardItem.onMove.subscribe((item) => this.itemDragging(item)),
                dragEndListener: dashboardItem.onMoveEnd.subscribe((item) => this.itemDraggingComplete(item)),

                resizeStartListener: dashboardItem.onResizeStart.subscribe((item) => this.itemResizing(item)),
                resizeListener: dashboardItem.onResize.subscribe((item) => this.itemResizing(item)),
                resizeEndListener: dashboardItem.onResizeEnd.subscribe((item) => this.itemResizingComplete(item)),
            }
        };

        this._registry.add(dashboardItem, layoutData);

        //Check that the added item has not caused a collision and if so move the others.
        //Only do this on items added after initialisation
        if (!this._initialItemIds.includes(dashboardItem.id)) {
            const items = this._itemUtils.compactLayout(this.items);
            this.syncItems(items);
        }
    }

    public removeItem(dashboardItem: DashboardItem)
    {
        if(this._registry.has(dashboardItem)) {
            const layoutData: LayoutData = this._registry.getData(dashboardItem)!;

            layoutData.unsubscribe.dragStartListener();
            layoutData.unsubscribe.dragListener();
            layoutData.unsubscribe.dragEndListener();
            layoutData.unsubscribe.resizeStartListener();
            layoutData.unsubscribe.resizeListener();
            layoutData.unsubscribe.resizeEndListener();

            this._registry.remove(dashboardItem);

            //Remove from initial Item Id check if it existed. This way the item can be added again and compacted
            const initialItemIdIndex = this._initialItemIds.findIndex((id) => {
                return id === dashboardItem.id;
            });

            if (initialItemIdIndex >= 0) {
                this._initialItemIds.splice(initialItemIdIndex, 1);
            }

            //Compact layout after removal
            const items = this._itemUtils.compactLayout(this.items);
            this.syncItems(items);
        }
    }

    getItemById(id: string | number)
    {
        return this._registry.find(id);
    }

    protected updateItems(): void
    {
        this._registry.each((dashboardItem: DashboardItem) => {
            dashboardItem.columnWidth = this._colWidth;
            dashboardItem.rowHeight = this._rowHeight;
            dashboardItem.margin = this._margin;
        });
    }

    // @TODO: Should this be ReadonlyArray<Item>?
    get items(): Array<Item>
    {
        return this._registry.map((dashboardItem: DashboardItem) => {
            return dashboardItem.toItem();
        });
    }

    // @TODO: Change to onItemDragging
    protected itemDragging(item: Item): void
    {
        if(!this._itemBeingDragged) {
            this.placeholder!.x = item.position.x;
            this.placeholder!.y = item.position.y;
            this.placeholder!.width = item.size.w;
            this.placeholder!.height = item.size.h;
            this.itemBeingDragged = true;
        }

        //Take a copy of items
        const itemsCopy = JSON.parse(JSON.stringify(this.items)) as Item[];
        //Remove the item being dragged as the placeholder takes its place. Otherwise the item will snap while being dragged.
        let items = itemsCopy.filter((i) => {
            return i.id !== item.id;
        });
        const placeholderIndex = items.findIndex((i) => {
            return i.id === this.placeholder!.id;
        });
        //items = this.correctBounds(items);
        items = this._itemUtils.moveItem(
            items,
            items[placeholderIndex]!,
            DashboardItem.getXFromLeft(item.left!, this.colWidth as number, this.margin),
            DashboardItem.getYFromTop(item.top!, this.rowHeight, this.margin),
            true
        );
        items = this._itemUtils.compactLayout(items);
        this.syncItems(items);
    }

    // @TODO: Change to onItemDraggingComplete
    protected itemDraggingComplete(item: Item): void
    {
        this.itemBeingDragged = false;
        const dashItem = this.getItemById(item.id);

        if (dashItem) {
            dashItem.x = this.placeholder!.x;
            dashItem.y = this.placeholder!.y;
        }

        this.placeholder!.x = 0;
        this.placeholder!.y = 0;
        this.placeholder!.width = 0;
        this.placeholder!.height = 0;
    }

    // @TODO: Change to onItemResizing
    protected itemResizing(item: Item): void
    {
        this.itemBeingResized = true;
        this.placeholder!.minWidth = item.minSize.w;
        this.placeholder!.maxWidth = item.maxSize.w;
        this.placeholder!.minHeight = item.minSize.h;
        this.placeholder!.maxHeight = item.maxSize.h;

        this.placeholder!.x = DashboardItem.getXFromLeft(
            item.left!,
            this.colWidth as number,
            this.margin
        );

        this.placeholder!.y = DashboardItem.getYFromTop(
            item.top!,
            this.rowHeight,
            this.margin
        );

        this.placeholder!.width = DashboardItem.getWidthFromPx(
            item.widthPx!,
            this.colWidth as number,
            this.margin
        );

        this.placeholder!.height = DashboardItem.getHeightFromPx(
            item.heightPx!,
            this.rowHeight,
            this.margin
        );

        //Take a copy of items
        const itemsCopy = JSON.parse(JSON.stringify(this.items)) as Item[];
        //Remove the item being resized as the placeholder takes its place. Otherwise the item will snap while being resized.
        let items = itemsCopy.filter((i) => {
            return i.id !== item.id;
        });
        const placeholderIndex = items.findIndex((i) => {
            return i.id === this.placeholder!.id;
        });
        items = this._itemUtils.moveItem(
            items,
            items[placeholderIndex]!,
            DashboardItem.getXFromLeft(item.left!, this.colWidth as number, this.margin),
            DashboardItem.getYFromTop(item.top!, this.rowHeight, this.margin),
            true
        );
        items = this._itemUtils.compactLayout(items);
        this.syncItems(items);
    }

    // @TODO: Change to onItemResizingComplete
    protected itemResizingComplete(item: Item): void
    {
        this.itemBeingResized = false;
        const dashItem = this.getItemById(item.id);
        if (dashItem) {
            dashItem.x = this.placeholder!.x;
            dashItem.y = this.placeholder!.y;
            dashItem.width = this.placeholder!.width;
            dashItem.height = this.placeholder!.height;
        }
        this.placeholder!.x = 0;
        this.placeholder!.y = 0;
        this.placeholder!.width = 0;
        this.placeholder!.height = 0;
    }

    // @TODO: is public due to LayoutItemUtils, if other todo is true, we can move this there to de-clutter.
    public getLockedItems(items: Array<Item>)
    {
        // @TODO: This was this way in source, should this be on argument items or not? does it matter?
        return this.items.filter((item: Item) => item.locked);
    }

    protected syncItems(items: Array<Item>)
    {
        items.forEach((i: Item) => {
            const dashboardItem = this.getItemById(i.id);

            dashboardItem?.fromItem(i);
        });
    }
}
