import type {Item, ListStepSnapshot, RecursionState } from '../Types/lab3Types'



export default function* recursiveHelper(
  itemIndex: number,
  currentWeight: number,
  currentValue: number,
  currentSelection: Item[],
  items: Item[],
  capacity: number,
  state: RecursionState
): Generator<ListStepSnapshot, void, unknown> {
  
  if (itemIndex === items.length) {
    if (currentWeight <= capacity && currentValue > state.bestValue) {
      state.bestValue = currentValue;
      state.bestCombination = [...currentSelection];
    }
    return;
  }

  const currentItem = items[itemIndex];

  yield {
    type: 'LIST_VIEW',
    currentItemChecking: currentItem,
    currentKnapsackItems: currentSelection,
    currentTotalWeight: currentWeight,
    currentTotalValue: currentValue,
    bestValueSoFar: state.bestValue,
    description: `[Глибина ${itemIndex}] Гілка 1: Пропускаємо "${currentItem.name}".`
  };
  yield* recursiveHelper(itemIndex + 1, currentWeight, currentValue, currentSelection, items, capacity, state);

  if (currentWeight + currentItem.weight > capacity) {
    yield {
      type: 'LIST_VIEW',
      currentItemChecking: currentItem,
      currentKnapsackItems: currentSelection,
      currentTotalWeight: currentWeight,
      currentTotalValue: currentValue,
      bestValueSoFar: state.bestValue,
      description: `[Глибина ${itemIndex}] Предмет "${currentItem.name}" не влазить за вагою. Відсікаємо.`
    };
    return; 
  }

  const newSelection = [...currentSelection, currentItem];
  yield {
    type: 'LIST_VIEW',
    currentItemChecking: currentItem,
    currentKnapsackItems: newSelection,
    currentTotalWeight: currentWeight + currentItem.weight,
    currentTotalValue: currentValue + currentItem.value,
    bestValueSoFar: state.bestValue,
    description: `[Глибина ${itemIndex}] Гілка 2: Беремо "${currentItem.name}".`
  };
  yield* recursiveHelper(
    itemIndex + 1, 
    currentWeight + currentItem.weight, 
    currentValue + currentItem.value, 
    newSelection,
    items,
    capacity,
    state
  );
}