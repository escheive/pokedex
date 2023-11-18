import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { InitialPokemon } from '../types';

// Define a type for our pokemonSlice state
interface PokemonState {
  initialPokemon: initialPokemon{};
}

const initialState: PokemonState = {
  initialPokemon: {},
}

export const pokemonSlice = createSlice({
  name: 'pokemon',
  initialState,  // pokemonSlice will infer the initialState from the initialState above
  reducers: {
    // Use the 'PayloadAction' type to declare the contents of 'action.payload'
    setInitialPokemon: (state, action: PayloadAction<InitialPokemon[]>) => {
      state.initialPokemon = action.payload;
    },
//     setDetailedPokemon: (state, action: PayloadAction<Pokemon[]>) => {
//       const { id, data } = action.payload;
//       state.detailedPokemon[id] = data;
//     },
  },
});

export const { setInitialPokemon } = pokemonSlice.actions;
// export method for useAppSelector to pull the data in the slice
export const selectPokemon = (state: RootState) => state.initialPokemon;

export default pokemonSlice.reducer;