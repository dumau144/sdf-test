import { clamp, length2 } from "./mathpls.js";

export const SDFsquare = (point, size) => {
  const absX = Math.abs(point.x);
  const absY = Math.abs(point.y);

  return (
    Math.abs(size - Math.max(
      Math.min(
        absX,
        absY,
        size
    ) + length2(
      point.x - clamp(point.x, -size, size),
      point.y - clamp(point.y, -size, size)
    ),
      absX,
      absY,
    ))
  )
}
