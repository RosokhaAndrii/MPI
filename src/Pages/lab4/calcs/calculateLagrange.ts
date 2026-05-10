import type { Point } from "../../../Types/lab4types";

export function calculateLagrange(points: Point[]) {
  const uniqueX = new Set(points.map((p) => p.x));
  if (uniqueX.size !== points.length) {
    throw new Error("Вузли інтерполяції повинні мати унікальні значення X");
  }

  const evaluate = (x: number): number => {
    let result = 0;

    for (let i = 0; i < points.length; i++) {
      let term = points[i].y;

      for (let j = 0; j < points.length; j++) {
        if (i !== j) {
          term *= (x - points[j].x) / (points[i].x - points[j].x);
        }
      }
      result += term;
    }

    return result;
  };

  return { evaluate };
}
