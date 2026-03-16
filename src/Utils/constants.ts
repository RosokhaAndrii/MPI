export const PHYSICS_CONSTANTS = {
  GRAVITY: 9.8, 
  AIR_RESISTANCE_DEFAULT: 1,
  MASS_DEFAULT: 200, 
} as const;


export const PARAM_LIMITS = {
  x0: { min: -100, max: 100, step: 0.1 },
  y0: { min: -100, max: 100, step: 0.1 },
} as const;


export const TRAJECTORY_COLORS: readonly string[] = [
  'hsl(0, 70%, 50%)',
  'hsl(60, 70%, 50%)',
  'hsl(120, 70%, 50%)',
  'hsl(180, 70%, 50%)',
  'hsl(240, 70%, 50%)',
  'hsl(300, 70%, 50%)',
  'hsl(30, 70%, 50%)',
  'hsl(90, 70%, 50%)',
] as const;

export const MAX_TRAJECTORIES = 8;