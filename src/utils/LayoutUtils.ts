import {Item} from "../interfaces/Item";

export class LayoutUtils
{
    public static checkCollision(a: Item, b: Item): boolean
    {
        if(a.id === b.id)
            return false;

        if(a.position.x + a.size.w <= b.position.x)
            return false;

        if(a.position.x >= b.position.x + b.size.w)
            return false;

        if(a.position.y + a.size.h <= b.position.y)
            return false;

        if(a.position.y >= b.position.y + b.size.h)
            return false

        return true;
    }

    public static getFirstCollision(items: Item[], toCheck: Item): Item | null
    {
        for(const item of items) {
            if(this.checkCollision(item, toCheck))
                return item;
        }

        return null;
    }

    public static getAllCollisions(items: Item[], toCheck: Item): Array<Item>
    {
        return items.filter((item) => {
            return this.checkCollision(item, toCheck);
        });
    }
}
