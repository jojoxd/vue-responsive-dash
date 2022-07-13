export interface LayoutData
{
    unsubscribe: {
        dragStartListener: () => void;
        dragListener: () => void;
        dragEndListener: () => void;

        resizeStartListener: () => void;
        resizeListener: () => void;
        resizeEndListener: () => void;
    };
}
