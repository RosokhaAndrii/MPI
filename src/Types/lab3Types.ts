export interface Item {
  id: string | number;
  name?: string;
  weight: number;
  value: number;
}

export interface BackPackConfig {
  capacity: number;
  items: Item[];
}

export type AlgorithmType =
  | "GREEDY"
  | "BRUTE_FORCE"
  | "RECURSION"
  | "DP"
  | "BRANCH_AND_BOUND";

export interface AlgorithmResult {
  maxValue: number;
  selectedItemIds: (string | number)[];
  totalWeight: number;
}

export interface ListStepSnapshot {
  type: "LIST_VIEW";
  currentItemChecking: Item | null;
  currentKnapsackItems: Item[];
  currentTotalWeight: number;
  currentTotalValue: number;
  bestValueSoFar: number;
  description: string;
}

export interface DPStepSnapshot {
  type: "DP_TABLE";
  dpMatrix: number[][];
  activeCell: { i: number; w: number } | null;
  comparingCells: { i: number; w: number }[];
  currentItem: Item | null;
  description: string;
}

export interface TreeNodeData {
  id: string;
  label: string;
  weight: number;
  value: number;
  bound?: number;
  isPruned?: boolean;
  isSolution?: boolean;
}

export interface TreeStepSnapshot {
  type: "TREE_VIEW";
  nodes: any[];
  edges: any[];
  activeNodeId: string | null;
  bestValueSoFar: number;
  description: string;
}

export type StepSnapshot = ListStepSnapshot | DPStepSnapshot | TreeStepSnapshot;

export type ExecutionStatus =
  | "IDLE"
  | "RUNNING"
  | "PAUSED"
  | "COMPLETED"
  | "ERROR";

export interface ExecutionState {
  status: ExecutionStatus;
  selectedAlgorithm: AlgorithmType;
  currentStepIndex: number;
  snapshots: StepSnapshot[];
  finalResult: AlgorithmResult | null;
  errorMessage: string | null;
}

export type ExecutionAction =
  | { type: "START"; algorithm: AlgorithmType }
  | { type: "PAUSE" }
  | { type: "RESUME" }
  | { type: "RESET" }
  | { type: "ADD_SNAPSHOT"; payload: StepSnapshot }
  | { type: "STEP_FORWARD" }
  | { type: "STEP_BACKWARD" }
  | { type: "FINISH"; payload: AlgorithmResult }
  | { type: "SET_ERROR"; error: string };

export interface ConfigState {
  capacity: number;
  items: Item[];
}

export type ConfigAction =
  | { type: "SET_CAPACITY"; payload: number }
  | { type: "ADD_ITEM"; payload: Omit<Item, "id"> }
  | { type: "REMOVE_ITEM"; payload: string | number }
  | { type: "CLEAR_ITEMS" };

export interface RecursionState {
  bestValue: number;
  bestCombination: Item[];
}

export interface Node {
  level: number;
  profit: number;
  weight: number;
  itemsSelected: Item[];
}
