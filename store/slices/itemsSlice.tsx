import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Define a type for our pokemonSlice state
interface ItemsState {
  data: [];
  loading: boolean;
  error: string | null;
}

const initialState: ItemsState = {
  data: [],
  loading: false,
  error: null,
}

export const itemsSlice = createSlice({
  name: 'items',
  initialState,  // itemsSlice will infer the initialState from the initialState above
  reducers: {
    // Use the 'PayloadAction' type to declare the contents of 'action.payload'
    setItems: (state, action) => {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      }
    },
  },
});

export const { setItems } = itemsSlice.actions;
// export method for useAppSelector to pull the data in the slice
export const selectItems = (state: RootState) => state.items;
// Selector for grabbing a specific item by ID
export const selectItemById = (state, itemId: number) => state.items.data[itemId]
export default itemsSlice.reducer;