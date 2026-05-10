import * as math from 'mathjs';

export function calculateLSA(points: {x: number, y: number}[], degree: number) {
  const n = points.length;
  const k = degree + 1; 
  if (n < k) throw new Error('Недостатньо точок');

  const Y = points.map(p => [p.y]);
  const X = points.map(p => {
    const row = [];
    for (let j = 0; j <= k - 1; j++) row.push(Math.pow(p.x, j));
    return row;
  });

  const mathX = math.matrix(X);
  const mathY = math.matrix(Y);

  const { Q, R } = math.qr(mathX);
  
  const QTY = math.multiply(math.transpose(Q), mathY);

  const R_square = math.subset(
    R, 
    math.index(math.range(0, k), math.range(0, k))
  );
  
  const QTY_sliced = math.subset(
    QTY, 
    math.index(math.range(0, k), math.range(0, 1))
  );
  
  const A = math.usolve(R_square as math.Matrix, QTY_sliced as math.Matrix);
  const coefficients = (A.valueOf() as number[][]).map(row => row[0]);

  const evaluate = (x: number): number => {
    let result = 0;
    for (let j = 0; j <= degree; j++) result += coefficients[j] * Math.pow(x, j);
    return result;
  };

  const residuals = points.map(p => p.y - evaluate(p.x));

  return { evaluate, coefficients, residuals };
}