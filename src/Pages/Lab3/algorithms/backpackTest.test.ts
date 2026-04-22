
// // import { solveDP } from './dp';
// // import { solveBruteForce } from './bruteForce';
// // import { solveGreedy } from './greedy';
// import type { Item } from "../../../Types/lab3Types";

// describe('Knapsack Algorithms - Variant 4', () => {
//   const variant4Items: Item[] = [
//     { id: 1, weight: 4, value: 5 },
//     { id: 2, weight: 3, value: 4 },
//     { id: 3, weight: 1, value: 2 },
//     { id: 4, weight: 2, value: 2 },
//     { id: 5, weight: 5, value: 6 },
//   ];
  
//   const CAPACITY = 9;

//   test('Dynamic Programming має знаходити оптимальний розв\'язок (цінність 12)', () => {
//     const result = solveDP(variant4Items, CAPACITY);
    
//     expect(result.maxValue).toBe(12);
//     expect(result.selectedItemIds.sort()).toEqual([2, 3, 5]); 
//   });

//   test('Brute Force має знаходити оптимальний розв\'язок (цінність 12)', () => {
//     const result = solveBruteForce(variant4Items, CAPACITY);
    
//     expect(result.maxValue).toBe(12);
//     expect(result.selectedItemIds.sort()).toEqual([2, 3, 5]);
//   });

//   test('Greedy Algorithm може не знайти абсолютний оптимум, але має працювати коректно', () => {
//     const result = solveGreedy(variant4Items, CAPACITY);
    
//     expect(result.maxValue).toBe(11);
//     expect(result.selectedItemIds.sort()).toEqual([1, 2, 3]);
//   });

//   test('Має повертати 0, якщо місткість рюкзака дорівнює 0', () => {
//     const result = solveDP(variant4Items, 0);
//     expect(result.maxValue).toBe(0);
//     expect(result.selectedItemIds).toEqual([]);
//   });

//   test('Має повертати 0, якщо немає доступних предметів', () => {
//     const result = solveDP([], CAPACITY);
//     expect(result.maxValue).toBe(0);
//     expect(result.selectedItemIds).toEqual([]);
//   });
// });