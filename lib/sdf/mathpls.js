export const clamp = (value, min, max) => Math.min(Math.max(min, value), max);

export const dot = (a, b) => a.x * b.x + a.y * b.y;

export const length2 = (x, y) => Math.sqrt(x * x + y * y);
export const length3 = (x, y, z) => Math.sqrt(x * x + y * y + z * z);

