import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

// Define a type for our pokemonSlice state
interface AbilitiesState {
  data: [];
  loading: boolean;
  error: string | null;
}

const initialState: AbilitiesState = {
  data: [],
  loading: false,
  error: null,
}

export const abilitiesSlice = createSlice({
  name: 'abilities',
  initialState,  // abilitiesSlice will infer the initialState from the initialState above
  reducers: {
    // Use the 'PayloadAction' type to declare the contents of 'action.payload'
    setAbilities: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
  },
});

export const { setAbilities } = abilitiesSlice.actions;
// export method for useAppSelector to pull the data in the slice
export const selectAbilities = (state: RootState) => state.abilities;
// Selector for grabbing a specific item by ID
export const selectAbilityById = (state, abilityId: number) => state.abilities.data[abilityId]
export default abilitiesSlice.reducer;