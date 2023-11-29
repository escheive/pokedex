import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { fetchAbilitiesDataFromApiOrDatabase, fetchAbilitiesFromApi } from '../../services/abilitiesService';
import { database } from '../../utils/database/database';
import { createAbilitiesTable, insertAbility } from '../../utils/database/abilitiesDatabase';

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

// // Define an asynchronous thunk for fetching Abilities data
// export const fetchAbilitiesData = createAsyncThunk('abilities/fetchAbilitiesData', async () => {
//   try {
//     // Directly call the fetch function
//     const abilitiesData = await fetchAbilitiesDataFromApiOrDatabase();
//     console.log(abilitiesData[0])
//     // Return the data
//     return abilitiesData;
//   } catch (error) {
//     console.error('Error fetching and inserting Abilities data:', error);
//     throw error;
//   }
// });

export const fetchAbilitiesData = createAsyncThunk('abilities/fetchAbilitiesData', async () => {
  console.log('fetchAbilities')
});

// // Define the asynchronous thunk for fetching Abilities data
// export const fetchAbilitiesData = createAsyncThunk('abilities/fetchAbilitiesData', async () => {
//   try {
//     // Wait for the table creation process to complete
//     await createAbilitiesTable();
//
//     const totalCount = 363; // Total number of abilities on PokeAPI
//     const batchSize = 20;
//     const batches = Math.ceil(totalCount / batchSize);
//
//     const fetchedAbilitiesData = [];
//
//     const hasData = await new Promise<boolean>((resolve, reject) => {
//       const start = 0;
//       const end = totalCount;
//       database.transaction((tx) => {
//         tx.executeSql(
//           `SELECT * FROM Abilities WHERE id BETWEEN ? AND ?;`,
//           [start, end],
//           (tx, result) => {
//             if (result.rows.length > 0) {
//               for (let i = 0; i < result.rows.length; i++) {
//                 const ability = result.rows.item(i);
//                 fetchedAbilitiesData.push(ability);
//               }
//             }
//             resolve(result.rows.length > 0);
//           },
//           (error) => {
//             console.error('Error checking Abilities data in the fetchAbilitiesData function, hasData subsection:', error);
//             reject(error);
//           }
//         );
//       });
//     });
//
//     if (!hasData) {
//       const batchInserts = [];
//       let page = 1;
//       let totalResults = 0;
//       const resultsPerPage = 20;
//
//       const fetchDataAndInsert = async () => {
//         try {
//           console.log('Batch:', page);
//           const fetchedData = await fetchAbilitiesFromApi(resultsPerPage, page);
//           batchInserts.push(insertAbility(fetchedData));
//           // Populate fetchedAbilitiesData as well since that is what we will return for our state
//           fetchedAbilitiesData.push(...fetchedData);
//
//           totalResults = 363; // Update with the actual total count from the API
//           // totalResults = data.count;
//           page++;
//           if ((page - 1) * resultsPerPage < totalResults) {
//             await fetchDataAndInsert();
//           } else {
//             await Promise.all(batchInserts);
//           }
//         } catch (error) {
//           console.error('Error in the !hasData section of fetchAbilitiesData function:', error);
//           throw error;
//         }
//       };
//
//       await fetchDataAndInsert();
//     }
//
//     return fetchedAbilitiesData;
//   } catch (error) {
//     console.error('Error fetching and inserting Abilities data in the fetchAbilitiesData function:', error);
//     throw error;
//   }
// });

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
//         // Perform any processing or filtering on the action.payload before updating state
//         const newAbilities = action.payload;
//         const existingIds = state.data.map((ability) => ability.id);
//
//         // Filter out abilities that already exist in the state
//         const filteredAbilities = newAbilities.filter(
//           (ability) => !existingIds.includes(ability.id)
//         );

        // Add the filtered abilities to the state
//         state.data = state.data.concat(filteredAbilities);
        state.data = action.payload;
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
export const selectAbilities = (state: RootState) => state.abilities; // Export selector that allows us to pull in data from the slice
export default abilitiesSlice.reducer; // Export the reducer so that we can import it to our redux store