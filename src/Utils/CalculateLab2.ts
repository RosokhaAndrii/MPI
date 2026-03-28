import type {
  CalculationParams,
  TrajectoryResult,
  TrajectoryPoint,
} from "../Types/TrajectoryTypes";
import { PHYSICS_CONSTANTS } from "./constants";

export function calculateLab2(params: CalculationParams): TrajectoryResult {
  const V0_abs = Math.abs(params.V0);
  const {  angle, x0 = 0, y0 = 0 } = params;
  const g = PHYSICS_CONSTANTS.GRAVITY;
  const V0 = V0_abs;

  if (V0 < 0) {
  throw new Error("Початкова швидкість не може бути від'ємною!");
}

  const rad = (angle * Math.PI) / 180;

  let v0x = V0 * Math.cos(rad);
  let v0y = V0 * Math.sin(rad);

  if (Math.abs(v0x) < 1e-10) v0x = 0;
  if (Math.abs(v0y) < 1e-10) v0y = 0;

  const D = v0y * v0y + 2 * g * y0;

  if (D < 0) {
    throw new Error("Недостатня швидкість: тіло не зможе вилетіти з ями (y₀ < 0)!");
  }

  const flightTime = (v0y + Math.sqrt(D)) / g;

  if (flightTime <= 0) {
    throw new Error("Тіло вже знаходиться на землі або кинуто вниз, політ неможливий.");
  }
  const maxHeight = y0 + (v0y * v0y) / (2 * g);
  const maxDistance = x0 + v0x * flightTime;

  const listTrajectories: TrajectoryPoint[] = [];
  
  const TARGET_POINTS_COUNT = 150;
  const dynamicDt = flightTime / TARGET_POINTS_COUNT;
  const dt = params.dt ? Math.max(params.dt, 0.01) : dynamicDt; 

  let maxSpeed = V0;

  for (let t = 0; t <= flightTime; t += dt) {
    const x = x0 + v0x * t;
    const y = y0 + v0y * t - (g * t * t) / 2;

    const vy = v0y - g * t;
    const currentSpeed = Math.sqrt(v0x * v0x + vy * vy);
    if (currentSpeed > maxSpeed) {
      maxSpeed = currentSpeed;
    }

    listTrajectories.push({ x, y: Math.max(0, y), t });
  }

  if (
    listTrajectories.length === 0 ||
    listTrajectories[listTrajectories.length - 1].t !== flightTime
  ) {
    const finalVy = v0y - g * flightTime;
    const finalSpeed = Math.sqrt(v0x * v0x + finalVy * finalVy);
    if (finalSpeed > maxSpeed) maxSpeed = finalSpeed;

    listTrajectories.push({ x: maxDistance, y: 0, t: flightTime });
  }

  return {
    listTrajectories,
    maxHeight,
    maxDistance,
    flightTime,
    maxSpeed,
    params: { ...params, a: g },
  };
}