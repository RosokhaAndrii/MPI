import { useState, useCallback } from 'react';
import type {
  CalculationParams,
  TrajectoryResult,
} from '../Types/TrajectoryTypes';
import { calculateLab1 } from '../Utils/CalculateLab1';

export function useTrajectory() {
  const [trajectory, setTrajectory] = useState<TrajectoryResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const calculate = useCallback((params: CalculationParams): TrajectoryResult | null => {
    setIsCalculating(true);
    setError(null);

    try {
      const result = calculateLab1(params);
      setTrajectory(result);
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Невідома помилка';
      setError(errorMessage);
      console.error('Помилка розрахунку:', err);
      return null;
    } finally {
      setIsCalculating(false);
    }
  }, []);

  const reset = useCallback(() => {
    setTrajectory(null);
    setError(null);
  }, []);

  return {
    trajectory,
    calculate,
    reset,
    isCalculating,
    error,
  };
}

