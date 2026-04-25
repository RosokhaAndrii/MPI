import type { Item, ListStepSnapshot, AlgorithmResult } from '../../../Types/lab3Types';

export function* solveGreedyGenerator(
  items: Item[],
  capacity: number
): Generator<ListStepSnapshot, AlgorithmResult, unknown> {
  
  let currentWeight = 0;
  let currentValue = 0;
  const currentKnapsackItems: Item[] = [];
  
  yield {
    type: 'LIST_VIEW',
    currentItemChecking: null,
    currentKnapsackItems: [],
    currentTotalWeight: 0,
    currentTotalValue: 0,
    bestValueSoFar: 0,
    description: "Крок 1. Отримуємо початковий список предметів."
  };

  const sortedItems = [...items].sort((a, b) => {
    const ratioA = a.value / a.weight;
    const ratioB = b.value / b.weight;
    return ratioB - ratioA; 
  });

  yield {
    type: 'LIST_VIEW',
    currentItemChecking: null,
    currentKnapsackItems: [],
    currentTotalWeight: 0,
    currentTotalValue: 0,
    bestValueSoFar: 0,
    description: "Крок 2. Сортуємо предмети за питомою цінністю (v/w) від найвищої до найнижчої."
  };

  for (let i = 0; i < sortedItems.length; i++) {
    const item = sortedItems[i];
    const ratio = (item.value / item.weight).toFixed(2);
    const descriptionPrefix = `Аналізуємо "${item.name}" (вага: ${item.weight}, v/w: ${ratio}). `;

    if (currentWeight + item.weight > capacity) {
      yield {
        type: 'LIST_VIEW',
        currentItemChecking: item,
        currentKnapsackItems: [...currentKnapsackItems],
        currentTotalWeight: currentWeight,
        currentTotalValue: currentValue,
        bestValueSoFar: currentValue,
        description: descriptionPrefix + `Не влазить (вільно: ${capacity - currentWeight}). Пропускаємо.`
      };
      continue; 
    }

    currentKnapsackItems.push(item);
    currentWeight += item.weight;
    currentValue += item.value;

    yield {
      type: 'LIST_VIEW',
      currentItemChecking: item,
      currentKnapsackItems: [...currentKnapsackItems],
      currentTotalWeight: currentWeight,
      currentTotalValue: currentValue,
      bestValueSoFar: currentValue,
      description: descriptionPrefix + `Влазить! Переміщуємо до рюкзака.`
    };
  }

  return {
    maxValue: currentValue,
    selectedItemIds: currentKnapsackItems.map(item => item.id.toString()),
    totalWeight: currentWeight
  };
}