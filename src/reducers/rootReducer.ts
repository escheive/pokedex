import { combineReducers } from 'redux';
import pokemonReducer from './pokemonReducer';
import abilitiesReducer from './abilitiesReducer';
import movesReducer from './movesReducer';
import speciesReducer from './speciesReducer';
import userReducer from './userReducer';
import pokeGrowerReducer from './pokeGrowerReducer';

const rootReducer = combineReducers({
    pokemon: pokemonReducer,
    abilities: abilitiesReducer,
    moves: movesReducer,
    speciesReducer,
    user: userReducer,
    pokeGrower: pokeGrowerReducer,
    // Add other reducers here
});

export default rootReducer;