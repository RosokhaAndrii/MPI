import { calculateLagrange } from "../calcs/calculateLagrange";
import { calculateNewton } from "../calcs/calculateNewton";
import { calculateLSA } from "../calcs/calculateLSA";

describe("Лабораторна робота 4: Інтерполяція та МНК (Варіант 4)", () => {
  const variant4Points = [
    { x: -2, y: 4.1 },
    { x: -1, y: 1.2 },
    { x: 0, y: 0.1 },
    { x: 1, y: 0.9 },
    { x: 2, y: 3.8 },
  ];

  describe("Інтерполяція (Лагранж та Ньютон)", () => {
    it("Поліном Лагранжа повинен точно проходити через усі 5 точок", () => {
      const { evaluate } = calculateLagrange(variant4Points);
      variant4Points.forEach((point) => {
        expect(evaluate(point.x)).toBeCloseTo(point.y, 5);
      });
    });

    it("Поліном Ньютона повинен точно проходити через усі 5 точок", () => {
      const { evaluate } = calculateNewton(variant4Points);

      variant4Points.forEach((point) => {
        expect(evaluate(point.x)).toBeCloseTo(point.y, 5);
      });
    });

    it("Методи Лагранжа та Ньютона повинні повертати однаковий результат для проміжних точок", () => {
      const lagrange = calculateLagrange(variant4Points);
      const newton = calculateNewton(variant4Points);
      const testX = 0.5;
      expect(lagrange.evaluate(testX)).toBeCloseTo(newton.evaluate(testX), 5);
    });
  });

  describe("Метод найменших квадратів (МНК)", () => {
    it("МНК повинен коректно розрахувати поліном та повернути масив залишків", () => {
      const targetDegree = 2;
      const { evaluate, residuals, coefficients } = calculateLSA(
        variant4Points,
        targetDegree,
      );
      expect(coefficients.length).toBe(targetDegree + 1);
      expect(residuals.length).toBe(variant4Points.length);
      variant4Points.forEach((point, index) => {
        const expectedResidual = point.y - evaluate(point.x);
        expect(residuals[index]).toBeCloseTo(expectedResidual, 5);
      });
    });

    it("Для МНК ступеня 4 (m = n - 1), графік має збігатися з інтерполяцією", () => {
      const { evaluate, residuals } = calculateLSA(variant4Points, 4);

      variant4Points.forEach((point) => {
        expect(evaluate(point.x)).toBeCloseTo(point.y, 4);
      });

      residuals.forEach((residual) => {
        expect(residual).toBeCloseTo(0, 4);
      });
    });
  });
});
