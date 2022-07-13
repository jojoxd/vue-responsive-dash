export class MathUtils
{
    public static clamp(num: number, min: number, max: number)
    {
        return Math.min(Math.max(num, min), max);
    }

    public static maybeClamp(num: number, min: any, max: any): number
    {
        const actualMin = typeof min === "number" ? min : num;
        const actualMax = typeof max === "number" ? max : num;

        return MathUtils.clamp(num, actualMin, actualMax);
    }
}
