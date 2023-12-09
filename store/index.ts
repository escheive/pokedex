import { configureStore } from '@reduxjs/toolkit';

import pokemonSlice from './slices/pokemonSlice';
import itemsSlice from './slices/itemsSlice';

const store = configureStore({
    reducer: {
      pokemon: pokemonSlice,
      items: itemsSlice,
    },
});

export default store;
// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {currency: CurrencyState, generators: GeneratorsState ...}
export type AppDispatch = typeof store.dispatch