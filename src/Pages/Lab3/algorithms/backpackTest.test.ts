import { solveDPGenerator } from './dpAlgorithm';
import solveBruteForceGenerator from './bruteForceAlgorithm';
import { solveGreedyGenerator } from './greedyAlgorithm';
import { solveRecursionGenerator } from './recursiveAlgorithm';
import { solveBranchGenerator } from './branchAlgorithm';
import type { Item, AlgorithmResult } from "../../../Types/lab3Types";

function solveDP(items: Item[], capacity: number): AlgorithmResult {
  const generator = solveDPGenerator(items, capacity);
  let result = generator.next();
  
  while (!result.done) {
    result = generator.next();
  }
  return result.value as AlgorithmResult;
}

function solveBruteForce(items: Item[], capacity: number): AlgorithmResult {
  const generator = solveBruteForceGenerator(items, capacity);
  let result = generator.next();
  
  while (!result.done) {
    result = generator.next();
  }
  return result.value as AlgorithmResult;
}

function solveGreedy(items: Item[], capacity: number): AlgorithmResult {
  const generator = solveGreedyGenerator(items, capacity);
  let result = generator.next();
  
  while (!result.done) {
    result = generator.next();
  }
  return result.value as AlgorithmResult;
}

function solveRecursion(items: Item[], capacity: number): AlgorithmResult {
  const generator = solveRecursionGenerator(items, capacity);
  let result = generator.next();
  
  while (!result.done) {
    result = generator.next();
  }
  return result.value as AlgorithmResult;
}

function solveBranchAndBound(items: Item[], capacity: number): AlgorithmResult {
  const generator = solveBranchGenerator(items, capacity);
  let result = generator.next();
  
  while (!result.done) {
    result = generator.next();
  }
  return result.value as AlgorithmResult;
}

describe("Knapsack Algorithms - Variant 4", () => {
  const variant4Items: Item[] = [
    { id: 1, weight: 4, value: 5 },
    { id: 2, weight: 3, value: 4 },
    { id: 3, weight: 1, value: 2 },
    { id: 4, weight: 2, value: 2 },
    { id: 5, weight: 5, value: 6 },
  ];
  
  const CAPACITY = 9;

  test("Динамічне програмування має знаходити оптимальний розв'язок (цінність 12)", () => {
    const result = solveDP(variant4Items, CAPACITY);
    expect(result.maxValue).toBe(12);
    expect(result.selectedItemIds.sort()).toEqual(['2', '3', '5']); 
  });

  test("Найпростіший алгоритм (перебір) має знаходити оптимальний розв'язок (цінність 12)", () => {
    const result = solveBruteForce(variant4Items, CAPACITY);
    expect(result.maxValue).toBe(12);
    expect(result.selectedItemIds.sort()).toEqual(['2', '3', '5']);
  });

  test("Жадібний має працювати коректно (цінність 11)", () => {
    const result = solveGreedy(variant4Items, CAPACITY);
    expect(result.maxValue).toBe(11);
    expect(result.selectedItemIds.sort()).toEqual(['1', '2', '3']);
  });

  test("Рекурсивний метод має знаходити оптимальний розв'язок (цінність 12)", () => {
    const result = solveRecursion(variant4Items, CAPACITY);
    expect(result.maxValue).toBe(12);
    expect(result.selectedItemIds.sort()).toEqual(['2', '3', '5']);
  });

  test("Метод гілок та меж має знаходити оптимальний розв'язок (цінність 12)", () => {
    const result = solveBranchAndBound(variant4Items, CAPACITY);
    expect(result.maxValue).toBe(12);
    expect(result.selectedItemIds.sort()).toEqual(['2', '3', '5']);
  });

  test("Має повертати 0, якщо місткість рюкзака дорівнює 0", () => {
    const result = solveDP(variant4Items, 0);
    expect(result.maxValue).toBe(0);
    expect(result.selectedItemIds).toEqual([]);
  });

  test("Має повертати 0, якщо немає доступних предметів", () => {
    const result = solveDP([], CAPACITY);
    expect(result.maxValue).toBe(0);
    expect(result.selectedItemIds).toEqual([]);
  });
});