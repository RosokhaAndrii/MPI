import type { Item, ListStepSnapshot, RecursionState } from '../Types/lab3Types';

export default function* recursiveHelper(
  itemIndex: number,
  currentWeight: number,
  currentValue: number,
  currentSelection: Item[],
  items: Item[],
  capacity: number,
  state: RecursionState & { nodeCounter?: number }, 
  parentId: string | null = null 
): Generator<ListStepSnapshot, void, unknown> {
  
  state.nodeCounter = (state.nodeCounter || 0) + 1;
  const currentNodeId = `node_${state.nodeCounter}`;
  const currentItem = items[itemIndex];

  if (itemIndex === items.length) {
    if (currentWeight <= capacity && currentValue > state.bestValue) {
      state.bestValue = currentValue;
      state.bestCombination = [...currentSelection];
    }
    yield {
      type: 'LIST_VIEW', 
      nodeId: currentNodeId,
      parentId: parentId,
      label: `Дно: v=${currentValue}, w=${currentWeight}`,
      currentItemChecking: null,
      currentKnapsackItems: currentSelection,
      currentTotalWeight: currentWeight,
      currentTotalValue: currentValue,
      bestValueSoFar: state.bestValue,
      description: `Досягли дна. Цінність гілки: ${currentValue}`
    };
    return;
  }

  yield {
    type: 'LIST_VIEW',
    nodeId: currentNodeId,
    parentId: parentId,
    label: `Предмет ${itemIndex + 1}`,
    currentItemChecking: currentItem,
    currentKnapsackItems: currentSelection,
    currentTotalWeight: currentWeight,
    currentTotalValue: currentValue,
    bestValueSoFar: state.bestValue,
    description: `Розглядаємо предмет "${currentItem.name}" на глибині ${itemIndex}.`
  };

  yield* recursiveHelper(
    itemIndex + 1, currentWeight, currentValue, currentSelection, items, capacity, state,
    currentNodeId 
  );

  if (currentWeight + currentItem.weight > capacity) {
    state.nodeCounter++;
    const deadEndId = `node_${state.nodeCounter}`;
    yield {
      type: 'LIST_VIEW',
      nodeId: deadEndId,
      parentId: currentNodeId,
      label: `Перевага`,
      currentItemChecking: currentItem,
      currentKnapsackItems: currentSelection,
      currentTotalWeight: currentWeight + currentItem.weight,
      currentTotalValue: currentValue,
      bestValueSoFar: state.bestValue,
      description: `Предмет "${currentItem.name}" не влазить. Відсікаємо гілку.`
    };
  } else {
    const newSelection = [...currentSelection, currentItem];
    yield* recursiveHelper(
      itemIndex + 1, 
      currentWeight + currentItem.weight, 
      currentValue + currentItem.value, 
      newSelection, items, capacity, state,
      currentNodeId 
    );
  }
}