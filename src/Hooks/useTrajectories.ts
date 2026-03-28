import { useState, useCallback } from 'react';
import type { CalculationParams, TrajectoryResult } from '../Types/TrajectoryTypes';

interface UseTrajectories {
  trajectories: TrajectoryResult[];
  addTrajectory: (params: CalculationParams) => boolean;
  replaceAll: (params: CalculationParams) => void;
  clear: () => void;
  count: number;
  error: string | null;
}

export function useTrajectories(
  calculateFn: (params: CalculationParams) => TrajectoryResult,
  maxTrajectories = 8
): UseTrajectories {
  const [trajectories, setTrajectories] = useState<TrajectoryResult[]>([]);
  const [error, setError] = useState<string | null>(null);

  const addTrajectory = useCallback(
    (params: CalculationParams): boolean => {
      if (trajectories.length >= maxTrajectories) {
        setError(`Максимум ${maxTrajectories} траєкторій!`);
        return false;
      }

      try {
        const result = calculateFn(params);
        setTrajectories((prev) => [...prev, result]);
        setError(null);
        return true;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Помилка розрахунку';
        setError(errorMessage);
        return false;
      }
    },
    [trajectories.length, maxTrajectories, calculateFn]
  );

  const replaceAll = useCallback((params: CalculationParams) => {
    try {
      const result = calculateFn(params);
      setTrajectories([result]);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Помилка розрахунку';
      setError(errorMessage);
    }
  }, [calculateFn]);

  const clear = useCallback(() => {
    setTrajectories([]);
    setError(null);
  }, []);

  return {
    trajectories,
    addTrajectory,
    replaceAll,
    clear,
    count: trajectories.length,
    error,
  };
}