import { configureStore } from '@reduxjs/toolkit';
import { pokemonSlice } from './reducers/pokemonSlice';

const store = configureStore({
    reducer: {
      pokemonSlice,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware(),
});

export default store;
// Infer the 'RootState' and 'AppDispatch' types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {currency: CurrencyState, generators: GeneratorsState ...}
export type AppDispatch = typeof store.dispatch