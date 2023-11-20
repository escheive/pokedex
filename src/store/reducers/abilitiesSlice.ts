import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createAbilitiesTable, fetchAbilitiesFromApi } from '../../services/abilitiesService';
import { insertAbility } from '../../utils/database/abilitiesDatabase';

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

// Define the asynchronous thunk for fetching Abilities data
export const fetchAbilitiesData = createAsyncThunk('abilities/fetchAbilitiesData', async () => {
  try {
    await createAbilitiesTable(); // Wait for the table creation process to complete

    const totalCount = 298; // The number of total abilities in the PokeApi as of now
    const start = 0;
    const end = 298;

    const fetchedAbilitiesData = await fetchAbilitiesFromApi(start, end);
    await insertAbility(fetchedAbilitiesData);

    return fetchedAbilitiesData;
  } catch (error) {
    console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData thunk:', error);
    throw error;
  }
});

export const abilitiesSlice = createSlice({
  name: 'abilities',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Case to set loading state to true while abilities are being fetched
      .addCase(fetchAbilitiesData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Case to set abilities data and reset loading to false
      .addCase(fetchAbilitiesData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      // Case to handle errors and reset loading to false
      .addCase(fetchAbilitiesData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Abilities data';
      });
  },
});

// Export method for useAppSelector and the reducer itself
export const selectAbilities = (state) => state.abilities; // This allows us to pull data in the slice

export default abilitiesSlice.reducer; // This allows us to import to the store