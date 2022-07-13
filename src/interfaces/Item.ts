import {Bound, Point} from "./types";

export interface Item {
    id: number | string;

    position: Point<number>;
    top?: number;
    left?: number;

    size: Bound<number>;

    minSize: Bound<number | false>;
    maxSize: Bound<number | false>;

    widthPx?: number;
    heightPx?: number;

    draggable?: boolean;
    resizable?: boolean;

    moved?: boolean;
    locked?: boolean;
}
