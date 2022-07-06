import { clamp, dot, length2, length3 } from "./mathpls.js";

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

export const SDFsquare3 = (point, size) => {
  const absX = Math.abs(point.x);
  const absY = Math.abs(point.y);
  const absZ = Math.abs(point.z);

  return (
    Math.abs(size - Math.max(
      Math.min(
        absX,
        absY,
        absZ,
        size
    ) + length3(
      point.x - clamp(point.x, -size, size),
      point.y - clamp(point.y, -size, size),
      point.z - clamp(point.z, -size, size)
    ),
      absX,
      absY,
      absZ,
    ))
  )
}
 
export const lineSegment = (p, a, b) => {
  const ba = {
    x: b.x - a.x,
    y: b.y - a.y,
  };

  const pa = {
    x: p.x - a.x,
    y: p.y - a.y,
  };

  const h = clamp(
    dot(pa, ba) / dot(ba, ba),
    0, 1
  );

  return length2(
    pa.x - h * ba.x,
    pa.y - h * ba.y
  );
};
