import { configureStore } from '@reduxjs/toolkit';

import pokemonSlice from './reducers/pokemonSlice';
import abilitiesSlice from './reducers/abilitiesSlice';

const store = configureStore({
    reducer: {
      pokemon: pokemonSlice,
      abilities: abilitiesSlice,
    },
});

export default store;
// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {currency: CurrencyState, generators: GeneratorsState ...}
export type AppDispatch = typeof store.dispatch