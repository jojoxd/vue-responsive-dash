import {Layout} from "./Layout";
import {Breakpoint} from "../interfaces/Breakpoints";
import {DashboardConstructorData} from "../interfaces/DashboardConstructorData";

export class Dashboard
{
    protected _id: string | number;

    protected _layouts: Array<Layout> = [];

    protected _autoHeight: boolean;

    protected _width: number;

    constructor(data: DashboardConstructorData)
    {
        this._id = data.id;
        this._autoHeight = data.autoHeight ?? true;
        this._width = data.width ?? 400;
    }

    get breakpoints(): Array<Breakpoint>
    {
        const breakpoints = [];
        for(const layout of this._layouts) {
            breakpoints.push({
                name: layout.breakpoint,
                numberOfCols: layout.numberOfCols,
                setpoint: layout.breakpointWidth,
            });
        }

        breakpoints.sort((a: Breakpoint, b: Breakpoint) => {
            if(typeof a.setpoint !== "undefined" && typeof b.setpoint !== "undefined") {
                return +a.setpoint - +b.setpoint;
            }

            if(typeof a.setpoint == "undefined") {
                return 1;
            }

            return -1;
        });

        return breakpoints;
    }

    get id()
    {
        return this._id;
    }

    get currentBreakpoint()
    {
        return this.updateCurrentBreakpoint();
    }

    get layouts(): Array<Layout>
    {
        return this._layouts;
    }

    set layouts(layouts: Array<Layout>)
    {
        this._layouts = layouts;
    }

    get autoHeight()
    {
        return this._autoHeight;
    }

    set autoHeight(autoHeight: boolean)
    {
        this._autoHeight = autoHeight;
    }

    get width()
    {
        return this._width;
    }

    set width(width: number)
    {
        this._width = width;
    }

    updateCurrentBreakpoint()
    {
        // Cache Breakpoints
        const breakpoints = this.breakpoints;

        //@TODO: check if we are right on the edge of a breakpoint (i.e. dont allow a change if a scroll bar is added)
        if(breakpoints.length == 0) {
            return ""; // @TODO: Empty String vs null?
        }

        let matching = breakpoints[0]!.name;
        for(let i = 1; i < breakpoints.length; i++) {
            if(typeof breakpoints[i]!.setpoint !== "undefined") {
                if(this.width > breakpoints[i]!.setpoint!) {
                    matching = breakpoints[i]!.name;
                }
            }
        }

        return matching;
    }

    /**
     * @deprecated Just use Dashboard.breakpoints getter.
     */
    sortBreakpoints()
    {
        // @NOTE: Won't do anything, also happens inside this.breakpoints getter
        this.breakpoints.sort((a, b) => {
            if (
                typeof a.setpoint !== "undefined" &&
                typeof b.setpoint !== "undefined"
            ) {
                return +a.setpoint - +b.setpoint;
            }
            if (typeof a.setpoint == "undefined") {
                return 1;
            }
            return -1;
        });
    }

    addLayoutInstance(layout: Layout)
    {
        this._layouts.push(layout);
    }

    updateLayouts()
    {
        for(const layout of this._layouts) {
            layout.width = this._width;
        }
    }

    removeLayoutInstance(layout: Layout)
    {
        const index = this.layouts.findIndex(l => l.breakpoint === layout.breakpoint);

        if(index >= 0) {
            this._layouts.splice(index, 1);
        }
    }
}
