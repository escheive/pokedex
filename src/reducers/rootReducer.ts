import { combineReducers } from 'redux';
import pokemonReducer from './pokemonReducer';
import abilitiesReducer from './abilitiesReducer';
import userReducer from './userReducer';

const rootReducer = combineReducers({
    pokemon: pokemonReducer,
    abilities: abilitiesReducer,
    user: userReducer,
    // Add other reducers here
});

export default rootReducer;