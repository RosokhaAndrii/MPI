import type { Item, ListStepSnapshot, AlgorithmResult } from '../../../Types/lab3Types';

interface Combination {
  items: Item[];
  totalWeight: number;
  totalValue: number;
}

export default function* solveBruteForceGenerator(
  items: Item[],
  capacity: number
): Generator<ListStepSnapshot, AlgorithmResult, unknown> {
  let combinations: Combination[] = [
    { items: [], totalWeight: 0, totalValue: 0 }
  ];

  let bestValueSoFar = 0;
  let bestCombination: Item[] = [];

  for (let i = 0; i < items.length; i++) {
    const currentItem = items[i];
    const newCombinations: Combination[] = [];
    for (const existingComb of combinations) {
      const nextWeight = existingComb.totalWeight + currentItem.weight;
      const nextValue = existingComb.totalValue + currentItem.value;

      const newComb: Combination = {
        items: [...existingComb.items, currentItem],
        totalWeight: nextWeight,
        totalValue: nextValue
      };

      newCombinations.push(newComb);

      if (nextWeight <= capacity && nextValue > bestValueSoFar) {
        bestValueSoFar = nextValue;
        bestCombination = newComb.items;
      }

      yield {
        type: 'LIST_VIEW',
        currentItemChecking: currentItem,
        currentKnapsackItems: newComb.items,
        currentTotalWeight: nextWeight,
        currentTotalValue: nextValue,
        bestValueSoFar: bestValueSoFar,
        description: `Крок ${i + 1}: Додаємо "${currentItem.name}" до існуючої підмножини. Всього варіантів: ${combinations.length + newCombinations.length}`
      };
    }

    combinations = [...combinations, ...newCombinations];
  }

  return {
    maxValue: bestValueSoFar,
    selectedItemIds: bestCombination.map(item => item.id.toString()),
    totalWeight: bestCombination.reduce((sum, item) => sum + item.weight, 0)
  };
}