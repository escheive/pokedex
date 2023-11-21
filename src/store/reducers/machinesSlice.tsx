import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Define a type for state
interface MachinesState {
  data: Machines[];
  loading: boolean;
  error: string | null;
}

const initialState: MachinesState = {
  data: [],
  loading: false,
  error: null,
};

// // Define an asynchronous thunk for fetching data
// export const fetchMachinesData = createAsyncThunk('machines/fetchMachinesData', async () => {
//   try {
//     // Directly call the fetch function
//     const machinesData = await insertFetchFunction
//     // Return the data
//     return machinesData;
//   } catch (error) {
//     console.error('Error fetching and inserting Machines data:', error);
//     throw error;
//   }
// });

export const machinesSlice = createSlice({
  name: 'machines',
  initialState,
  reducers: {},
});

export const selectMachines = (state) => state.machines; // Export selector that allows us to pull in data from the slice
export default machinesSlice.reducer; // Export the reducer so that we can import it to our redux store