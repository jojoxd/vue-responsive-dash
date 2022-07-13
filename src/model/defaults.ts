import {ResizeEdge} from "../utils/ResizeEdge";

// @TODO: Look for sensible defaults (from source)
export const DashboardItemDefaults = Object.freeze({
    x: 0,
    y: 0,

    width: 1,
    minWidth: 1,
    maxWidth: false,

    height: 1,
    minHeight: 1,
    maxHeight: false,

    draggable: true,
    resizable: true,

    resizeEdges: ResizeEdge.All,
    resizeHandleSize: 8,

    draggableZIndex: 1,
    resizableZIndex: 1,

    moveHold: 0,
    resizeHold: 0,

    dragAllowFrom: null,
    dragIgnoreFrom: null,

    locked: false,
});

// @TODO: Look for sensible defaults (from source)
export const LayoutDefaults = Object.freeze({

    numberOfCols: 12,

    breakpointWidth: undefined,

    useCssTransforms: false,

    compact: true,
    marginX: 10,
    marginY: 10,

    rowHeight: 100, // @TODO: This was false in source
    minRowHeight: false,
    maxRowHeight: false,

    colWidth: 100,  // @TODO: This was false in source
    minColWidth: false,
    maxColWidth: false,

    autoHeight: true,

    width: 400,
    height: 400,

})