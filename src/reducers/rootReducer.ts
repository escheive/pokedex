import { combineReducers } from 'redux';
import pokemonReducer from './pokemonReducer';
import abilitiesReducer from './abilitiesReducer';
import movesReducer from './movesReducer';
import speciesReducer from './speciesReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    pokemon: pokemonReducer,
    abilities: abilitiesReducer,
    moves: movesReducer,
    speciesReducer,
    user: userReducer,
    // Add other reducers here
});

export default rootReducer;