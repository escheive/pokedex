import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { fetchPokemonFromAPI } from '../../services/pokemonService';
import { database } from '../../utils/database/database';
import { createPokemonTable, insertPokemon } from '../../utils/database/pokemonDatabase';

// Define a type for our pokemonSlice state
interface PokemonState {
  data: [];
  loading: boolean;
  error: string | null;
}

const initialState: PokemonState = {
  data: [],
  loading: false,
  error: null,
}

// Define the asynchronous thunk for fetching Pokemon data
export const fetchPokemonData = createAsyncThunk('pokemon/fetchPokemonData', async () => {
  try {
    // Wait for the table creation process to complete
    await createPokemonTable();

    const totalCount = 40;
    const batchSize = 20;
    const batches = Math.ceil(totalCount / batchSize);

    const fetchedPokemonData: InitialPokemon[] = [];

    const hasData = await new Promise<boolean>((resolve, reject) => {
      const start = 0;
      const end = totalCount;
      database.transaction((tx) => {
        tx.executeSql(
          `SELECT * FROM Pokemon WHERE id BETWEEN ? AND ?;`,
          [start, end],
          (tx, result) => {
            if (result.rows.length > 0) {
              for (let i = 0; i < result.rows.length; i++) {
                const pokemon = result.rows.item(i);
                fetchedPokemonData.push(pokemon);
              }
            }
            resolve(result.rows.length > 0);
          },
          (error) => {
            console.error('Error checking Pokemon data in the fetchPokemonData function, hasData subsection:', error);
            reject(error);
          }
        );
      });
    });

    if (!hasData) {
      const batchInserts = [];
      let page = 1;
      let totalResults = 0;
      const resultsPerPage = 20;

      const fetchDataAndInsert = async () => {
        try {
          console.log('Batch:', page);
          const fetchedData = await fetchPokemonFromAPI(resultsPerPage, page);
          batchInserts.push(insertPokemon(fetchedData));
          // Populated fetchedPokemonData as well since that is what we will return for our state
          fetchedPokemonData.push(...fetchedData);

          totalResults = 40;
          // totalResults = data.count;
          page++;
          if ((page - 1) * resultsPerPage < totalResults) {
            await fetchDataAndInsert();
          } else {
            await Promise.all(batchInserts);
          }
        } catch (error) {
          console.error('Error in the !hasData section of fetchPokemonData function:', error);
          throw error;
        }
      };

      await fetchDataAndInsert();
    }

    return fetchedPokemonData;
  } catch (error) {
    console.error('Error fetching and inserting Pokemon data in the fetchPokemonData function:', error);
    throw error;
  }
});

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,  // pokemonSlice will infer the initialState from the initialState above
  reducers: {
    // Use the 'PayloadAction' type to declare the contents of 'action.payload'
    setPokemon: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    setFavoriteStatus: (state, action) => {
      const { pokemonId, isFavorite } = action.payload;
      // Find the pokemon in the pokemon array and update its favorite status
      const pokemonIndex = state.data.findIndex(pokemon => pokemon.id === pokemonId);
      if (pokemonIndex !== -1) {
        state.data[pokemonIndex].isFavorite = isFavorite
      }
    },
    setCaptureStatus: (state, action) => {
      const { pokemonId, isCaught } = action.payload;
      // Find the pokemon in the pokemon array and update its captured status
      if (pokemonIndex !== -1) {
        state.data[pokemonIndex].isCaptured = isCaptured;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPokemonData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPokemonData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPokemonData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch Pokemon data';
      });
  },
});

export const { setPokemon, setFavoriteStatus, setCaptureStatus } = pokemonSlice.actions;
// export method for useAppSelector to pull the data in the slice
export const selectPokemon = (state: RootState) => state.pokemon;

export default pokemonSlice.reducer;