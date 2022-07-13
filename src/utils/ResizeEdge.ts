export enum ResizeEdge
{
    // @TODO: Do we actually need the cardinal directions?
    Top = 1 << 0,
    Right = 1 << 1,
    Bottom = 1 << 2,
    Left = 1 << 3,

    TopRight = Top | Right,
    BottomRight = Bottom | Right,
    BottomLeft = Bottom | Left,
    TopLeft = Top | Left,

    All = Top | Right | Bottom | Left,
}

export function isResizeEdge(edge: ResizeEdge, contains: ResizeEdge)
{
    return contains === (edge & contains);
}
