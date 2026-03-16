export interface TrajectoryPoint {
  x: number;
  y: number;
  t: number;
}


export interface SimulationParams {
  V0: number;    
  angle: number; 
  a: number;     
  x0: number;    
  y0: number;    
}

export interface CalculationParams extends SimulationParams {
  maxTime?: number; 
  dt?: number;      
}

export interface TrajectoryResult {
  listTrajectories: TrajectoryPoint[];
  maxHeight: number;
  maxDistance: number;
  flightTime: number;
  maxSpeed: number;
  params: SimulationParams;
}

export interface GravityParams {
  V0: number;
  angle: number;
  x0?: number;
  y0?: number;
  g?: number;
  maxTime?: number;
  dt?: number;
}

export type TrajectoryColor = string;

export const CalculationStatus = {
  Idle: 'idle',
  Calculating: 'calculating',
  Success: 'success',
  Error: 'error'
} as const;

export type CalculationStatus = typeof CalculationStatus[keyof typeof CalculationStatus];

