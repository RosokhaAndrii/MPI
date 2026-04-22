import type { Item } from "../Types/lab3Types";
export default function calculateBound(
  level: number, 
  currentWeight: number, 
  currentValue: number, 
  capacity: number, 
  sortedItems: Item[]
): number {
  if (currentWeight >= capacity) return 0;
  
  let profitBound = currentValue;
  let totWeight = currentWeight;
  let j = level + 1;

  while (j < sortedItems.length && totWeight + sortedItems[j].weight <= capacity) {
    totWeight += sortedItems[j].weight;
    profitBound += sortedItems[j].value;
    j++;
  }

  if (j < sortedItems.length) {
    profitBound += (capacity - totWeight) * (sortedItems[j].value / sortedItems[j].weight);
  }
  return profitBound;
}
