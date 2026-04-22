import type { Item, ListStepSnapshot, AlgorithmResult, RecursionState } from '../../../Types/lab3Types';
import recursiveHelper from '../../../Utils/RecursiveHelper'


export function* solveRecursionGenerator(
  items: Item[],
  capacity: number
): Generator<ListStepSnapshot, AlgorithmResult, unknown> {
  
  const state: RecursionState = { bestValue: 0, bestCombination: [] };

  yield* recursiveHelper(0, 0, 0, [], items, capacity, state);

  return {
    maxValue: state.bestValue,
    selectedItemIds: state.bestCombination.map(item => item.id.toString()),
    totalWeight: state.bestCombination.reduce((sum, item) => sum + item.weight, 0)
  };
}