import type { Point } from "../../../Types/lab4types";
export function calculateNewton(points: Point[]) {
  const n = points.length;

  const uniqueX = new Set(points.map((p) => p.x));
  if (uniqueX.size !== points.length) {
    throw new Error("Вузли інтерполяції повинні мати унікальні значення X");
  }

  const f: number[][] = Array.from({ length: n }, () => Array(n).fill(0));

  for (let i = 0; i < n; i++) {
    f[i][0] = points[i].y;
  }

  for (let j = 1; j < n; j++) {
    for (let i = 0; i < n - j; i++) {
      f[i][j] =
        (f[i + 1][j - 1] - f[i][j - 1]) / (points[i + j].x - points[i].x);
    }
  }

  const evaluate = (x: number): number => {
    let result = f[0][0];
    let product = 1;

    for (let j = 1; j < n; j++) {
      product *= x - points[j - 1].x;
      result += f[0][j] * product;
    }

    return result;
  };

  return { evaluate, dividedDifferences: f };
}
