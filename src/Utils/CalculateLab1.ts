import type {
  CalculationParams,
  TrajectoryResult,
  TrajectoryPoint,
} from '../Types/TrajectoryTypes';


export function calculateLab1(params: CalculationParams): TrajectoryResult {
  const {
    V0,
    angle,
    a,
    x0 = 0,
    y0 = 0,
    maxTime = 100,
    dt = 0.01,
  } = params;

  const listTrajectories: TrajectoryPoint[] = [];
  let t = 0;
  let maxHeight = 0;

  const angleRad = (angle * Math.PI) / 180;

  const Vx = V0 * Math.cos(angleRad);
  const Vy = V0 * Math.sin(angleRad);

  const ax = a * Math.cos(angleRad);
  const ay = a * Math.sin(angleRad);

  let maxSpeed = V0;

  while (t <= maxTime) {
    const xAxis = x0 + Vx * t + (ax * Math.pow(t, 2)) / 2;
    const yAxis = y0 + Vy * t + (ay * Math.pow(t, 2)) / 2;

    const currentVx = Vx + ax * t;
    const currentVy = Vy + ay * t;
    const currentSpeed = Math.sqrt(currentVx ** 2 + currentVy ** 2);

    if (yAxis > maxHeight) maxHeight = yAxis;
    if (currentSpeed > maxSpeed) maxSpeed = currentSpeed;

    listTrajectories.push({ x: xAxis, y: yAxis, t });
    t += dt;
  }

  const lastPoint = listTrajectories[listTrajectories.length - 1];

  return {
    listTrajectories,
    maxHeight,
    maxDistance: lastPoint.x,
    flightTime: lastPoint.t,
    maxSpeed,
    params: { V0, angle, a, x0, y0 },
  };
}

export function validateParams(params: Partial<CalculationParams>): string | null {
  if (params.V0 !== undefined && (params.V0 <= 0 || params.V0 > 200)) {
    return 'Швидкість повинна бути від 1 до 200 м/с';
  }
  if (params.angle !== undefined && (params.angle < 0 || params.angle > 90)) {
    return 'Кут повинен бути від 0 до 90 градусів';
  }
  if (params.a !== undefined && (params.a < 0 || params.a > 10)) {
    return 'Прискорення повинно бути від 0 до 10 м/с²';
  }
  return null;
}