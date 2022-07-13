/**
 * Point is an x,y component
 */
export type Point<T = number> = {
  x: T;
  y: T;
};

/**
 * Bound is a w,h component
 */
export type Bound<T = number> = {
  w: T;
  h: T;
}

/**
 * Rect is an x,y,w,h component
 */
export type Rect<TPoint = number, TBound = TPoint> = Point<TPoint> & Bound<TBound>;
