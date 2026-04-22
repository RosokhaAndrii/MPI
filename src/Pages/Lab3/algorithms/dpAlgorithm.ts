import type {
  Item,
  DPStepSnapshot,
  AlgorithmResult,
} from "../../../Types/lab3Types";

export function* solveDPGenerator(
  items: Item[],
  capacity: number,
): Generator<DPStepSnapshot, AlgorithmResult, unknown> {
  const n = items.length;
  const dp: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(capacity + 1).fill(0));

  for (let i = 1; i <= n; i++) {
    const currentItem = items[i - 1];

    for (let w = 1; w <= capacity; w++) {
      let snapshotDescription = `Розрахунок комірки [${i}][${w}]. `;
      const comparingCells = [{ i: i - 1, w }];

      if (currentItem.weight > w) {
        dp[i][w] = dp[i - 1][w];
        snapshotDescription += `Вага предмета (${currentItem.weight}) більша за поточну місткість (${w}). Копіюємо значення зверху.`;

        yield {
          type: "DP_TABLE",
          dpMatrix: dp.map((row) => [...row]),
          activeCell: { i, w },
          comparingCells,
          currentItem,
          description: snapshotDescription,
        };

        continue;
      }

      const valueWithoutItem = dp[i - 1][w];
      const valueWithItem =
        currentItem.value + dp[i - 1][w - currentItem.weight];

      dp[i][w] = Math.max(valueWithoutItem, valueWithItem);
      comparingCells.push({ i: i - 1, w: w - currentItem.weight });

      if (valueWithItem > valueWithoutItem) {
        snapshotDescription += `Предмет влазить і покращує результат (${valueWithItem} > ${valueWithoutItem})`;
      } else {
        snapshotDescription += `Предмет влазить, але попередній результат кращий (${valueWithoutItem} >= ${valueWithItem}), тому пропускаємо.`;
      }

      yield {
        type: "DP_TABLE",
        dpMatrix: dp.map((row) => [...row]),
        activeCell: { i, w },
        comparingCells,
        currentItem,
        description: snapshotDescription,
      };
    }
  }

  yield {
    type: "DP_TABLE",
    dpMatrix: dp.map((row) => [...row]),
    activeCell: null,
    comparingCells: [],
    currentItem: null,
    description: "Шукаємо вибрані предмети...",
  };

  const selectedItemIds: string[] = [];
  let currentCapacity = capacity;
  let totalWeight = 0;

  for (let i = n; i > 0 && currentCapacity > 0; i--) {
    if (dp[i][currentCapacity] !== dp[i - 1][currentCapacity]) {
      const item = items[i - 1];
      selectedItemIds.push(item.id.toString());
      totalWeight += item.weight;
      currentCapacity -= item.weight;
    }
  }

  return {
    maxValue: dp[n][capacity],
    selectedItemIds,
    totalWeight,
  };
}
