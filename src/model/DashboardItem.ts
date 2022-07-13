import {SimpleEventDispatcher} from "ste-simple-events";
import {MathUtils} from "../utils/MathUtils";
import {ResizeEvent} from "@interactjs/actions/resize/plugin";
import {Bound, Point} from "../interfaces/types";
import {Item} from "../interfaces/Item";
import {DashboardItemConstructorData} from "../interfaces/DashboardItemConstructorData";
import {ResizeEdge} from "../utils/ResizeEdge";
import {DashboardItemDefaults} from "./defaults";

export class DashboardItem
{
    protected _id: number | string;

    protected _position: Point<number>;

    protected _gridSize: Bound<number>;

    protected _margin: Point;

    protected _left: number;
    protected _top: number;

    protected _size: Bound<number>;

    protected _minSize: Bound<number | false>;
    protected _maxSize: Bound<number | false>;

    protected _sizePx: Bound<number>;

    // @TODO: Change to isDraggable
    protected _draggable: boolean;

    // @TODO: Change to isResizable
    protected _resizable: boolean;

    protected _resizeEdges: ResizeEdge;
    protected _resizeHandleSize: number;

    protected _moved: boolean = false;
    protected _hover: boolean = false;

    protected _resizeHold: number;

    protected _moveHold: number;

    // @TODO: Change to isLocked
    protected _locked: boolean;

    // @TODO: Change to isMoving
    protected _moving: boolean = false;

    // @TODO: Change to isResizing
    protected _resizing: boolean = false;

    protected _onMoveStartEventDispatcher = new SimpleEventDispatcher<Item>();
    protected _onMoveEventDispatcher = new SimpleEventDispatcher<Item>();
    protected _onMoveEndEventDispatcher = new SimpleEventDispatcher<Item>();

    protected _onResizeStartEventDispatcher = new SimpleEventDispatcher<Item>();
    protected _onResizeEventDispatcher = new SimpleEventDispatcher<Item>();
    protected _onResizeEndEventDispatcher = new SimpleEventDispatcher<Item>();

    constructor(item: Item & DashboardItemConstructorData) {
        this._id = item.id;

        this._position = item.position ?? {
            x: DashboardItemDefaults.x,
            y: DashboardItemDefaults.y,
        };

        this._size = item.size ?? {
            w: DashboardItemDefaults.width,
            h: DashboardItemDefaults.height,
        };

        this._minSize = item.minSize ?? {
            w: DashboardItemDefaults.minWidth,
            h: DashboardItemDefaults.minHeight,
        };

        this._maxSize = item.maxSize ?? {
            w: DashboardItemDefaults.maxWidth,
            h: DashboardItemDefaults.maxHeight,
        };

        // @TODO: Needs to be in DashboardItemDefaults
        this._gridSize = item.gridSize ?? { w: 1, h: 1 };

        // @TODO: Needs to be in DashboardItemDefaults
        this._margin = item.margin ?? {x: 1, y: 1};

        this._draggable = item.draggable ?? DashboardItemDefaults.draggable;
        this._resizable = item.resizable ?? DashboardItemDefaults.resizable;

        this._resizeEdges = item.resizeEdges ?? DashboardItemDefaults.resizeEdges

        this._resizeHandleSize = item.resizeHandleSize ?? DashboardItemDefaults.resizeHandleSize;
        this._moveHold = item.moveHold ?? DashboardItemDefaults.moveHold;
        this._resizeHold = item.resizeHold ?? DashboardItemDefaults.resizeHold;
        this._locked = item.locked ?? DashboardItemDefaults.locked;

        // Unknown what these default values need to be?
        this._left = 0;
        this._top = 0;

        this._sizePx = { w: 0, h: 0 };
        this.updatePositionAndSize();
    }

    /// <editor-fold name="Getters / Setters (MAGIC)">
    get id() {
        return this._id;
    }

    get x() {
        return this._position.x;
    }

    set x(x: number) {
        this._position.x = x;
        this.updatePositionAndSize();
    }

    get y() {
        return this._position.y;
    }

    set y(y: number) {
        this._position.y = y;
        this.updatePositionAndSize();
    }

    get columnWidth() {
        return this._gridSize.w;
    }

    set columnWidth(columnWidth: number) {
        this._gridSize.w = columnWidth;
        this.updatePositionAndSize();
    }

    get rowHeight() {
        return this._gridSize.h;
    }

    set rowHeight(rowHeight: number) {
        this._gridSize.h = rowHeight;
        this.updatePositionAndSize();
    }

    get margin() {
        return this._margin;
    }

    set margin(margin: Point<number>)
    {
        this._margin = margin;
        this.updatePositionAndSize();
    }

    get left() {
        return this._left;
    }

    set left(left: number) {
        if (!this._moving && !this._resizing) {
            this._left = left;
        }
    }

    get top() {
        return this._top;
    }

    set top(top: number) {
        if (!this._moving && !this._resizing) {
            this._top = top;
        }
    }

    get minWidth()
    {
        return this._minSize.w;
    }

    set minWidth(minWidth: number | false)
    {
        this._minSize.w = minWidth;
    }

    get maxWidth()
    {
        return this._maxSize.w;
    }

    set maxWidth(maxWidth: number | false)
    {
        this._maxSize.w = maxWidth;
    }

    get width()
    {
        return this._size.w;
    }

    set width(width: number)
    {
        this._size.w = width;
        this.checkSizeLimits();
        this.updatePositionAndSize();
    }

    get minHeight()
    {
        return this._minSize.h;
    }

    set minHeight(minHeight: number | false)
    {
        this._minSize.h = minHeight;
    }

    get maxHeight()
    {
        return this._maxSize.h;
    }

    set maxHeight(maxHeight: number | false)
    {
        this._maxSize.h = maxHeight;
    }

    get height()
    {
        return this._size.h;
    }

    set height(height: number)
    {
        this._size.h = height;
        this.checkSizeLimits();
        this.updatePositionAndSize();
    }

    get widthPx()
    {
        return this._sizePx.w;
    }

    set widthPx(widthPx: number)
    {
        if(!this._resizing) {
            this._sizePx.w = widthPx;
        }
    }

    get heightPx()
    {
        return this._sizePx.h;
    }

    set heightPx(heightPx: number)
    {
        if(!this._resizing) {
            this._sizePx.h = heightPx;
        }
    }

    get hover()
    {
        return this._hover;
    }

    set hover(hover: boolean)
    {
        this._hover = hover;
    }

    get moveHold()
    {
        return this._moveHold;
    }

    set moveHold(moveHold: number)
    {
        this._moveHold = moveHold;
    }

    get resizeHold()
    {
        return this._resizeHold;
    }

    set resizeHold(resizeHold: number)
    {
        this._resizeHold = resizeHold;
    }

    get moving()
    {
        return this._moving;
    }

    get resizing()
    {
        return this._resizing;
    }
    /// </editor-fold>

    /**
     * @TODO: Remove checkSizeLimits? is it used somewhere else then in setters?
     * @deprecated Clamp in setters instead?
     */
    checkSizeLimits()
    {
        this._size.w = MathUtils.maybeClamp(this._size.w, this._minSize.w, this._maxSize.w);
        this._size.h = MathUtils.maybeClamp(this._size.h, this._minSize.h, this._maxSize.h);
    }

    updatePositionAndSize()
    {
        this._left = DashboardItem.getLeftFromX(this._position.x, this._gridSize.w, this._margin);
        this._top = DashboardItem.getTopFromY(this._position.y, this._gridSize.h, this._margin);
        this._sizePx.w = DashboardItem.getWidthInPx(this._size.w, this._gridSize.w, this._margin);
        this._sizePx.h = DashboardItem.getHeightInPx(this._size.h, this._gridSize.h, this._margin);
    }

    toItem(): Item
    {
        return {
            position: { x: this.x, y: this.y, },
            size: { w: this.width, h: this.height },
            minSize: { w: this._minSize.w, h: this._minSize.h },
            maxSize: { w: this._maxSize.w, h: this._maxSize.h },
            draggable: this._draggable,
            id: this._id,
            locked: this._locked,
            moved: this._moved,
            resizable: this._resizable,

            top: this.top,
            left: this.left,
            widthPx: this.widthPx,
            heightPx: this.heightPx,
        };
    }

    // @NOTE: This is used by Layout to save some positional data, so this is important
    fromItem(item: Item)
    {
        // @TODO: Add DashboardItem.fromItem(item: Item)
    }

    _onMoveStart()
    {
        this._moving = true;
        this._onMoveStartEventDispatcher.dispatch(this.toItem());
    }

    _onMove(left: number, top: number)
    {
        this._left += left;
        this._top += top;
        this._onMoveEventDispatcher.dispatch(this.toItem());
    }

    _onMoveEnd()
    {
        this._moving = false;
        this._onMoveEndEventDispatcher.dispatch(this.toItem());
    }

    get onMoveStart()
    {
        return this._onMoveStartEventDispatcher.asEvent();
    }

    get onMove()
    {
        return this._onMoveEventDispatcher.asEvent();
    }

    get onMoveEnd()
    {
        return this._onMoveEndEventDispatcher.asEvent();
    }

    _onResizeStart()
    {
        this._resizing = true;
        this._onResizeStartEventDispatcher.dispatch(this.toItem());
    }

    _onResize(event: ResizeEvent)
    {
        this._left += event.deltaRect!.left;
        this._top += event.deltaRect!.top;
        this._sizePx.w = event.rect.width;
        this._sizePx.h = event.rect.height;
        this._onResizeEventDispatcher.dispatch(this.toItem());
    }

    _onResizeEnd()
    {
        this._resizing = false;
        this._onResizeEndEventDispatcher.dispatch(this.toItem());
    }

    get onResizeStart()
    {
        return this._onResizeStartEventDispatcher.asEvent();
    }

    get onResize()
    {
        return this._onResizeEventDispatcher.asEvent();
    }

    get onResizeEnd()
    {
        return this._onResizeEndEventDispatcher.asEvent();
    }

    static getLeftFromX(x: number, colWidth: number, margin: Point<number>)
    {
        return Math.round(colWidth * x + (x + 1) * margin.x);
    }

    static getXFromLeft(l: number, colWidth: number, margin: Point<number>)
    {
        return Math.round((l - margin.x) / (colWidth + margin.x));
    }

    static getTopFromY(y: number, rowHeight: number, margin: Point<number>)
    {
        return Math.round(rowHeight * y + (y + 1) * margin.y);
    }

    static getYFromTop(t: number, rowHeight: number, margin: Point<number>)
    {
        return Math.round((t - margin.y) / (rowHeight + margin.y));
    }

    static getWidthInPx(w: number, colWidth: number, margin: Point<number>)
    {
        return Math.round(colWidth * w + Math.max(0, w - 1) * margin.x);
    }

    static getWidthFromPx(widthPx: number, colWidth: number, margin: Point<number>)
    {
        return Math.round((widthPx + margin.x) / (colWidth + margin.x));
    }

    static getHeightInPx(h: number, rowHeight: number, margin: Point<number>)
    {
        return Math.round(rowHeight * h + Math.max(0, h - 1) * margin.y);
    }

    static getHeightFromPx(heightPx: number, rowHeight: number, margin: Point<number>)
    {
        return Math.round((heightPx + margin.y) / (rowHeight + margin.y));
    }

    /**
     * @TODO: Migrate to composition API
     * @deprecated use Composition API Instead
     */
    static cssTransform(
        top: number,
        left: number,
        widthPx: number,
        heightPx: number
    ) {
        const translate = "translate3d(" + left + "px," + top + "px, 0)";
        return {
            transform: translate,
            WebkitTransform: translate,
            MozTransform: translate,
            msTransform: translate,
            OTransform: translate,
            width: widthPx + "px",
            height: heightPx + "px",
        };
    }

    /**
     * @TODO: Migrate to composition API
     * @deprecated use Composition API Instead
     */
    static cssTopLeft(
        top: number,
        left: number,
        widthPx: number,
        heightPx: number
    ) {
        return {
            top: top + "px",
            left: left + "px",
            width: widthPx + "px",
            height: heightPx + "px",
        };
    }
}