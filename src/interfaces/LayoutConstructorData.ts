import {Point} from "./types";
import {Item} from "./Item";

export interface LayoutConstructorData
{
    breakpoint: string;

    numberOfCols?: number,

    breakpointWidth?: number;

    margin?: Point;

    autoHeight?: boolean;

    useCssTransforms?: boolean;

    width?: number;

    height?: number;

    rowHeight?: number;

    minRowHeight?: number | boolean;

    maxRowHeight?: number | boolean;

    colWidth?: number;

    minColWidth?: number | boolean;

    maxColWidth?: number | boolean;

    compact?: boolean;

    initialItems?: Item[];
}
