import { combineReducers } from 'redux';
import pokemonReducer from './pokemonReducer';
import abilitiesReducer from './abilitiesReducer';

const rootReducer = combineReducers({
    pokemon: pokemonReducer,
    abilities: abilitiesReducer,
    // Add other reducers here
});

export default rootReducer;