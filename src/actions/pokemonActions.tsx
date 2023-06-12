import { database } from '../utils/database/database';
import { updatePokemonFavoriteStatus, updatePokemonCaptureStatus, updatePokemonStatus } from '../utils/database/pokemonDatabase';
import { FETCH_POKEMON_REQUEST, FETCH_POKEMON_SUCCESS, FETCH_POKEMON_FAILURE, UPDATE_POKEMON_STATUS } from './ActionTypes';

// Dispatched when requesting pokemon data
export const fetchPokemonRequest = () => ({
    type: FETCH_POKEMON_REQUEST
});

// Dispatched when pokemon data is successfully fetched
export const fetchPokemonSuccess = (pokemonList) => {
    return {
        type: FETCH_POKEMON_SUCCESS,
        payload: pokemonList
    };
};

// Dispatched when there is an error fetching pokemon data
export const fetchPokemonFailure = (error) => ({
    type: FETCH_POKEMON_FAILURE,
    payload: error
});

// Dispatched when updating pokemon favorite or isCaught status
export const updatePokemonStatusAction = (id, field, value) => {
    return (dispatch) => {
        // Update the state by dispatching the action
        dispatch({
            type: UPDATE_POKEMON_STATUS,
            payload: { id, [field]: value }
        });
        // Update the database using the database update function
        updatePokemonStatus(id, field, value)
    };
};