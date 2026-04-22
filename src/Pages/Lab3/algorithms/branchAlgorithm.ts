import type { Item, ListStepSnapshot, AlgorithmResult, Node } from '../../../Types/lab3Types';
import calculateBound from '../../../Utils/calculateBranch';

export function* solveBranchGenerator(
  items: Item[],
  capacity: number
): Generator<ListStepSnapshot, AlgorithmResult, unknown> {
  
  const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  const stack: Node[] = []; 
  let bestValue = 0;
  let bestCombination: Item[] = [];

  stack.push({ level: -1, profit: 0, weight: 0, itemsSelected: [] });

  while (stack.length > 0) {
    const u = stack.pop()!; 

    if (u.level === sortedItems.length - 1) continue; 

    const nextLevel = u.level + 1;
    const currentItem = sortedItems[nextLevel];

    const weightWith = u.weight + currentItem.weight;
    const profitWith = u.profit + currentItem.value;
    const selectionWith = [...u.itemsSelected, currentItem];

    if (weightWith <= capacity && profitWith > bestValue) {
      bestValue = profitWith;
      bestCombination = selectionWith;
    }

    const boundWith = calculateBound(nextLevel, weightWith, profitWith, capacity, sortedItems);

    yield {
      type: 'LIST_VIEW',
      currentItemChecking: currentItem,
      currentKnapsackItems: selectionWith,
      currentTotalWeight: weightWith,
      currentTotalValue: profitWith,
      bestValueSoFar: bestValue,
      description: `Гілка "Беремо ${currentItem.name}". Межа: ${boundWith.toFixed(2)}. Рекорд: ${bestValue}.`
    };

    if (boundWith > bestValue && weightWith <= capacity) {
      stack.push({ level: nextLevel, profit: profitWith, weight: weightWith, itemsSelected: selectionWith });
    } else {
      yield {
        type: 'LIST_VIEW',
        currentItemChecking: currentItem,
        currentKnapsackItems: selectionWith,
        currentTotalWeight: weightWith,
        currentTotalValue: profitWith,
        bestValueSoFar: bestValue,
        description: `Межа ${boundWith.toFixed(2)} не перевищує рекорд (${bestValue}), або перевантаження.`
      };
    }

    const boundWithout = calculateBound(nextLevel, u.weight, u.profit, capacity, sortedItems);

    yield {
      type: 'LIST_VIEW',
      currentItemChecking: currentItem,
      currentKnapsackItems: u.itemsSelected,
      currentTotalWeight: u.weight,
      currentTotalValue: u.profit,
      bestValueSoFar: bestValue,
      description: `Гілка "Пропускаємо ${currentItem.name}". Межа: ${boundWithout.toFixed(2)}.`
    };

    if (boundWithout > bestValue) {
      stack.push({ level: nextLevel, profit: u.profit, weight: u.weight, itemsSelected: u.itemsSelected });
    } else {
      yield {
        type: 'LIST_VIEW',
        currentItemChecking: currentItem,
        currentKnapsackItems: u.itemsSelected,
        currentTotalWeight: u.weight,
        currentTotalValue: u.profit,
        bestValueSoFar: bestValue,
        description: `Межа ${boundWithout.toFixed(2)} не перевищує рекорд (${bestValue}).`
      };
    }
  }

  return {
    maxValue: bestValue,
    selectedItemIds: bestCombination.map(item => item.id.toString()),
    totalWeight: bestCombination.reduce((sum, item) => sum + item.weight, 0)
  };
}