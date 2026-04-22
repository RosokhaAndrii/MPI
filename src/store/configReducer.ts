import type {Item, ConfigAction, ConfigState} from '../Types/lab3Types'


export const initialConfigState: ConfigState = {
  capacity: 9,
  items: [
    { id: '1', name: 'Предмет 1', weight: 4, value: 5 },
    { id: '2', name: 'Предмет 2', weight: 3, value: 4 },
    { id: '3', name: 'Предмет 3', weight: 1, value: 2 },
    { id: '4', name: 'Предмет 4', weight: 2, value: 2 },
    { id: '5', name: 'Предмет 5', weight: 5, value: 6 },
  ],
};

export function configReducer(state: ConfigState, action: ConfigAction): ConfigState {
  switch (action.type) {
    case 'SET_CAPACITY':
      return { ...state, capacity: Math.max(0, action.payload) };
      
    case 'ADD_ITEM': {
      const newItem: Item = {
        ...action.payload,
        id: Date.now().toString(), 
      };
      return { ...state, items: [...state.items, newItem] };
    }
    
    case 'REMOVE_ITEM':
      return { 
        ...state, 
        items: state.items.filter(item => item.id !== action.payload) 
      };
      
    case 'CLEAR_ITEMS':
      return { ...state, items: [] };
      
    default:
      return state;
  }
}