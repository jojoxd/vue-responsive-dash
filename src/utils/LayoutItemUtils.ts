import {Layout} from "../model/Layout";
import {LayoutUtils} from "../utils/LayoutUtils";
import {Item} from "../interfaces/Item";

export class LayoutItemUtils
{
    protected readonly _layout: Layout;

    constructor(layout: Layout)
    {
        this._layout = layout;
    }

    protected get numberOfCols()
    {
        return this._layout.numberOfCols;
    }

    protected get compact()
    {
        return this._layout.compact;
    }

    public correctBounds(items: Array<Item>): Array<Item>
    {
        return items.map(item => this.correctItemBounds(item));
    }

    public correctItemBounds(item: Item): Item
    {
        if(item.position.x + item.size.w > this.numberOfCols)
            item.position.x = this.numberOfCols - item.size.w;

        if(item.position.x < 0)
            item.position.x = 0;

        if(item.position.y < 0)
            item.position.y = 0;

        if(item.size.w > this.numberOfCols) {
            item.position.x = 0;
            item.size.w = this.numberOfCols;
        }

        return item;
    }

    public compactLayout(items: Array<Item>): Array<Item>
    {
        const compareWith = this._layout.getLockedItems(items);

        const out: Array<Item> = [];
        for(let item of this.sortItems(items)) {

            if(!item.locked) {
                item = this.compactItem(compareWith, item);

                // Add to comparison array. We only collide with items before this one.
                compareWith.push(item);
            }

            // Add to output array to make sure they still come out in the right order.
            const index = items.findIndex((findItem: Item) => {
                return findItem.id === item.id;
            });

            out[index] = item;

            // Clear moved flag, if it exists
            item.moved = false;
        }

        return out;
    }

    public compactItem(items: Array<Item>, toCompact: Item)
    {
        if(this.compact) {
            while (toCompact.position.y > 0 && !LayoutUtils.getFirstCollision(items, toCompact)) {
                toCompact.position.y--;
            }
        }

        let collides;
        while((collides = LayoutUtils.getFirstCollision(items, toCompact))) {
            toCompact.position.y = collides.position.y + collides.size.h;
        }

        return toCompact;
    }

    public sortItems(items: Array<Item>, reverse: boolean = false): Array<Item>
    {
        // @TODO: Wat
        const i = JSON.parse(JSON.stringify(items)) as Item[];

        i.sort((a, b) => {
            if (a.position.y > b.position.y || (a.position.y === b.position.y && a.position.x > b.position.x)) {
                return 1;
            }
            return -1;
        });

        if (reverse) {
            i.reverse();
        }

        return i;
    }

    public moveItem(items: Array<Item>, d: Item, x: number, y: number, isUserAction: boolean = false)
    {
        if(d.locked) {
            return items;
        }

        const movingUp: boolean = d.position.y > y;

        d.position.x = x;
        d.position.y = y;
        d.moved = true;

        d = this.correctItemBounds(d);

        const sorted = this.sortItems(items, movingUp);
        const collisions = LayoutUtils.getAllCollisions(sorted, d);

        for(const collision of collisions) {
            if(collision.moved)
                continue;

            // This makes it feel a bit more precise by waiting to swap for just a bit when moving up.
            if(d.position.y > collision.position.y && d.position.y - collision.position.y > collision.size.h / 4)
                continue;

            const collisionIndex = items.findIndex((item: Item) => {
                return item.id === collision.id;
            });

            if(collision.locked) {
                items = this.moveItemsFromCollision(
                    items,
                    items[collisionIndex]!,
                    d,
                    isUserAction
                );
            } else {
                items = this.moveItemsFromCollision(
                    items,
                    d,
                    items[collisionIndex]!,
                    isUserAction
                );
            }
        }

        return items;
    }

    public moveItemsFromCollision(items: Item[], collidesWith: Item, itemToMove: Item, isUserAction: boolean = false)
    {
        // @TODO: Why only on user action?
        if(isUserAction) {
            const fakeItem: Item = {
                id: "-1fakeItem",
                position: {
                    x: itemToMove.position.x,
                    y: Math.max(collidesWith.position.y - itemToMove.size.h, 0),
                },

                size: {
                    w: itemToMove.size.w,
                    h: itemToMove.size.h
                },

                minSize: {
                    w: itemToMove.minSize.w,
                    h: itemToMove.minSize.h,
                },

                maxSize: {
                    w: itemToMove.maxSize.w,
                    h: itemToMove.maxSize.h,
                }
            }

            if(!LayoutUtils.getFirstCollision(items, fakeItem)) {
                return this.moveItem(items, itemToMove, itemToMove.position.x, fakeItem.position.y);
            }
        }

        return this.moveItem(items, itemToMove, itemToMove.position.x, itemToMove.position.y);
    }
}