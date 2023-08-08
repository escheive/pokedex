import { combineReducers } from 'redux';
import pokemonReducer from './pokemonReducer';
import abilitiesReducer from './abilitiesReducer';
import movesReducer from './movesReducer';
import speciesReducer from './speciesReducer';
import userReducer from './userReducer';
import pokeGrowerReducer from './pokeGrowerReducers/pokeGrowerReducer';
import purchasedUpgradesReducer from './pokeGrowerReducers/purchasedUpgradesReducer'

const rootReducer = combineReducers({
    pokemon: pokemonReducer,
    abilities: abilitiesReducer,
    moves: movesReducer,
    speciesReducer,
    user: userReducer,
    pokeGrower: pokeGrowerReducer,
    purchasedUpgrades: purchasedUpgradesReducer,
    // Add other reducers here
});

export default rootReducer;