import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchAbilitiesDataFromApiOrDatabase } from '../../services/abilitiesService';

// Define a type for abilitiesSlice state
interface AbilitiesState {
  data: Ability[];
  loading: boolean;
  error: string | null;
}

const initialState: AbilitiesState = {
  data: [],
  loading: false,
  error: null,
};

// Define an asynchronous thunk for fetching Abilities data
export const fetchAbilitiesData = createAsyncThunk('abilities/fetchAbilitiesData', async () => {
  try {
    await fetchAbilitiesDataFromApiOrDatabase();
  } catch (error) {
    console.error('Error fetching and inserting Abilities data:', error);
    return rejectWithValue(error.message);
  }
});

export const abilitiesSlice = createSlice({
  name: 'abilities',
  initialState,
  reducers: {
    // Action that sets abilities in the abilities state
    setAbilities: (state, action) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Action that reset our abilities state to free up memory, will use when a user navigates away from a page that displays all abilities
    resetAbilities: (state) => {
      state.data = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbilitiesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbilitiesData.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchAbilitiesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setAbilities, resetAbilities } = abilitiesSlice.actions; // Export action that allows us to set abilities state
export const selectAbilities = (state) => state.abilities; // Export selector that allows us to pull in data from the slice
export default abilitiesSlice.reducer; // Export the reducer so that we can import it to our redux store