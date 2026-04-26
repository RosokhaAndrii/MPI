import { useState, useEffect, useCallback } from "react";
import type { AlgorithmType, Item, AlgorithmResult } from "../Types/lab3Types";

import { solveDPGenerator } from "../Pages/Lab3/algorithms/dpAlgorithm";
import solveBruteForceGenerator from "../Pages/Lab3/algorithms/bruteForceAlgorithm";
import { solveGreedyGenerator } from "../Pages/Lab3/algorithms/greedyAlgorithm";
import { solveRecursionGenerator } from "../Pages/Lab3/algorithms/recursiveAlgorithm";
import { solveBranchGenerator } from "../Pages/Lab3/algorithms/branchAlgorithm";

interface UseAlgorithmExecutionProps {
  algorithm: AlgorithmType;
  items: Item[];
  capacity: number;
}

export function useAlgorithmExecution({
  algorithm,
  items,
  capacity,
}: UseAlgorithmExecutionProps) {
  const [status, setStatus] = useState<
    "IDLE" | "RUNNING" | "PAUSED" | "COMPLETED" | "ERROR"
  >("IDLE");

  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(50);
  const [finalResult, setFinalResult] = useState<AlgorithmResult | null>(null);

  useEffect(() => {
    handleReset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, capacity, algorithm]);

  const handleReset = useCallback(() => {
    setStatus("IDLE");
    setSteps([]);
    setCurrentStep(0);
    setFinalResult(null);
  }, []);

  const handlePlay = useCallback(() => {
    if (status === "IDLE" || status === "COMPLETED") {
      let generator;
      switch (algorithm) {
        case "DP":
          generator = solveDPGenerator(items, capacity);
          break;
        case "BRUTE_FORCE":
          generator = solveBruteForceGenerator(items, capacity);
          break;
        case "GREEDY":
          generator = solveGreedyGenerator(items, capacity);
          break;
        case "RECURSION":
          generator = solveRecursionGenerator(items, capacity);
          break;
        case "BRANCH_AND_BOUND":
          generator = solveBranchGenerator(items, capacity);
          break;
        default:
          return;
      }

      try {
        const generatedSteps = [];
        let result = generator.next();

        while (!result.done) {
          generatedSteps.push(result.value);
          result = generator.next();
        }

        setSteps(generatedSteps);
        setFinalResult(result.value as AlgorithmResult);
        setCurrentStep(0);
      } catch (error) {
        console.error("Помилка генерації:", error);
        setStatus("ERROR");
        return;
      }
    }

    setStatus("RUNNING");
  }, [algorithm, items, capacity, status]);

  const handlePause = useCallback(() => setStatus("PAUSED"), []);
  const handleStepForward = useCallback(() => {
    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  }, [steps.length]);

  const handleStepBackward = useCallback(() => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  }, []);

  useEffect(() => {
    if (status !== "RUNNING") return;

    if (currentStep >= steps.length - 1) {
      setStatus("COMPLETED");
      return;
    }

    const delay = 1050 - speed * 10;

    const timerId = setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, delay);

    return () => clearTimeout(timerId);
  }, [status, currentStep, steps.length, speed]);

  const handleSkipToEnd = useCallback(() => {
    if (status === "IDLE") {
      let generator;
      switch (algorithm) {
        case "DP":
          generator = solveDPGenerator(items, capacity);
          break;
        case "BRUTE_FORCE":
          generator = solveBruteForceGenerator(items, capacity);
          break;
        case "GREEDY":
          generator = solveGreedyGenerator(items, capacity);
          break;
        case "RECURSION":
          generator = solveRecursionGenerator(items, capacity);
          break;
        case "BRANCH_AND_BOUND":
          generator = solveBranchGenerator(items, capacity);
          break;
        default:
          return;
      }

      try {
        const generatedSteps = [];
        let result = generator.next();

        while (!result.done) {
          generatedSteps.push(result.value);
          result = generator.next();
        }

        setSteps(generatedSteps);
        setFinalResult(result.value as AlgorithmResult);
        setCurrentStep(generatedSteps.length - 1);
        setStatus("COMPLETED");
      } catch (error) {
        console.error("Помилка генерації:", error);
        setStatus("ERROR");
      }
    } else {
      setCurrentStep(steps.length - 1);
      setStatus("COMPLETED");
    }
  }, [algorithm, items, capacity, status, steps.length]);

  return {
    status,
    currentStep,
    totalSteps: steps.length > 0 ? steps.length - 1 : 0,
    currentSnapshot: steps[currentStep] || null,
    steps,
    finalResult,
    description:
      steps[currentStep]?.description || "Натисніть Play для початку",
    speed,
    setSpeed,
    handlePlay,
    handlePause,
    handleStepForward,
    handleStepBackward,
    handleSkipToEnd,
    handleReset,
  };
}
