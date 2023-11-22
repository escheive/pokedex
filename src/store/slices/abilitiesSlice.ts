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
    // Directly call the fetch function
    const abilitiesData = await fetchAbilitiesDataFromApiOrDatabase();
    // Return the data
    return abilitiesData;
  } catch (error) {
    console.error('Error fetching and inserting Abilities data:', error);
    throw error;
  }
});

export const abilitiesSlice = createSlice({
  name: 'abilities',
  initialState,
  reducers: {
//     // Action that sets abilities in the abilities state
//     setAbilities: (state, action) => {
//       state.data = action.payload;
//       state.loading = false;
//       state.error = null;
//     },
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
        // Perform any processing or filtering on the action.payload before updating state
        const newAbilities = action.payload;
        const existingIds = state.data.map((ability) => ability.id);

        // Filter out abilities that already exist in the state
        const filteredAbilities = newAbilities.filter(
          (ability) => !existingIds.includes(ability.id)
        );

        // Add the filtered abilities to the state
        state.data = state.data.concat(filteredAbilities);
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