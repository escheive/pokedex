import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define a type for state
interface MovesState {
  data: Machines[];
  loading: boolean;
  error: string | null;
}

const initialState: MovesState = {
  data: [],
  loading: false,
  error: null,
};

// // Define an asynchronous thunk for fetching data
// export const fetchMovesData = createAsyncThunk('moves/fetchMovesData', async () => {
//   try {
//     // Directly call the fetch function
//     const movesData = await insertFetchFunction
//     // Return the data
//     return movesData;
//   } catch (error) {
//     console.error('Error fetching and inserting Moves data:', error);
//     throw error;
//   }
// });

export const movesSlice = createSlice({
  name: 'moves',
  initialState,
  reducers: {},
});

export const selectMoves = (state) => state.moves; // Export selector that allows us to pull in data from the slice
export default movesSlice.reducer; // Export the reducer so that we can import it to our redux store