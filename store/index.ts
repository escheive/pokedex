import { configureStore } from '@reduxjs/toolkit';

import pokemonSlice from './slices/pokemonSlice';

const store = configureStore({
    reducer: {
      pokemon: pokemonSlice,
    },
});

export default store;
// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {currency: CurrencyState, generators: GeneratorsState ...}
export type AppDispatch = typeof store.dispatch