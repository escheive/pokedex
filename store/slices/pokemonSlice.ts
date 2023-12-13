import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

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

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,  // pokemonSlice will infer the initialState from the initialState above
  reducers: {
    // Use the 'PayloadAction' type to declare the contents of 'action.payload'
    setPokemon: (state, action) => {
      return {
        ...state,
        data: action.payload,
        loading: false,
        error: null,
      }
    },
  },
});

export const { setPokemon } = pokemonSlice.actions;
// export method for useAppSelector to pull the data in the slice
export const selectPokemon = (state: RootState) => state.pokemon;
// Selector for grabbing a specific pokemon by ID
export const selectPokemonById = (state, pokemonId: number) => state.pokemon.data[pokemonId]
export default pokemonSlice.reducer;