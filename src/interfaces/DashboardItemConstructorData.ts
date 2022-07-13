import {Bound, Point} from "./types";
import {ResizeEdge} from "../utils/ResizeEdge";

export interface DashboardItemConstructorData
{
    gridSize: Bound<number>;

    margin?: Point;

    resizeEdges?: ResizeEdge;

    resizeHandleSize?: number;

    moveHold?: number;

    resizeHold?: number;
}
