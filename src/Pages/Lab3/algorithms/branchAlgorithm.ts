import type { Item, ListStepSnapshot, AlgorithmResult, StackNode } from '../../../Types/lab3Types';
import calculateBound from '../../../Utils/calculateBranch'; 



export function* solveBranchGenerator(
  items: Item[],
  capacity: number
): Generator<ListStepSnapshot, AlgorithmResult, unknown> {
  
  const sortedItems = [...items].sort((a, b) => (b.value / b.weight) - (a.value / a.weight));
  
  const stack: StackNode[] = []; 
  let bestValue = 0;
  let bestCombination: Item[] = [];
  let nodeCounter = 0; 

  nodeCounter++;
  const rootId = `node_${nodeCounter}`;
  stack.push({ level: -1, profit: 0, weight: 0, itemsSelected: [], id: rootId });

  yield {
    type: 'LIST_VIEW',
    nodeId: rootId,
    parentId: null,
    label: 'Корінь (Початок)',
    currentItemChecking: null,
    currentKnapsackItems: [],
    currentTotalWeight: 0,
    currentTotalValue: 0,
    bestValueSoFar: 0,
    description: 'Початок алгоритму Гілок'
  };

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
    nodeCounter++;
    const takeNodeId = `node_${nodeCounter}`;

    const isTakePruned = boundWith <= bestValue || weightWith > capacity;

    yield {
      type: 'LIST_VIEW',
      nodeId: takeNodeId,
      parentId: u.id, 
      label: isTakePruned ? `❌ Беремо ${currentItem.name}` : `+ Беремо ${currentItem.name}`,
      currentItemChecking: currentItem,
      currentKnapsackItems: selectionWith,
      currentTotalWeight: weightWith,
      currentTotalValue: profitWith,
      bestValueSoFar: bestValue,
      description: isTakePruned 
        ? `ВІДСІЧЕНО: Межа (${boundWith.toFixed(1)}) менша за найбільше значення (${bestValue}) або забагато ваги .`
        : `Гілка "Беремо". Межа потенційного рішення: ${boundWith.toFixed(1)}. Додаємо в стек.`
    };

    if (!isTakePruned) {
      stack.push({ level: nextLevel, profit: profitWith, weight: weightWith, itemsSelected: selectionWith, id: takeNodeId });
    }

    const boundWithout = calculateBound(nextLevel, u.weight, u.profit, capacity, sortedItems);
    nodeCounter++;
    const skipNodeId = `node_${nodeCounter}`;

    const isSkipPruned = boundWithout <= bestValue;

    yield {
      type: 'LIST_VIEW',
      nodeId: skipNodeId,
      parentId: u.id, 
      label: isSkipPruned ? `❌ Пропуск ${currentItem.name}` : `- Пропуск ${currentItem.name}`,
      currentItemChecking: currentItem,
      currentKnapsackItems: u.itemsSelected,
      currentTotalWeight: u.weight,
      currentTotalValue: u.profit,
      bestValueSoFar: bestValue,
      description: isSkipPruned
        ? `ВІДСІЧЕНО: Межа (${boundWith.toFixed(1)}) менша за найбільше значенння (${bestValue}) або забагато ваги .`
        : `Гілка "Беремо". Межа потенційного рішення: ${boundWith.toFixed(1)}. Додаємо в стек.`
    };

    if (!isSkipPruned) {
      stack.push({ level: nextLevel, profit: u.profit, weight: u.weight, itemsSelected: u.itemsSelected, id: skipNodeId });
    }
  }

  return {
    maxValue: bestValue,
    selectedItemIds: bestCombination.map(item => item.id.toString()),
    totalWeight: bestCombination.reduce((sum, item) => sum + item.weight, 0)
  };
}