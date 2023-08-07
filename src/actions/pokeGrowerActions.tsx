import { database } from '../utils/database/database';
import { FETCH_POKEGROWER_REQUEST, FETCH_POKEGROWER_SUCCESS, FETCH_POKEGROWER_FAILURE, POKEGROWER_INCREMENT } from './ActionTypes';

// Dispatched when requesting pokemon data
export const fetchPokeGrowerRequest = () => ({
    type: FETCH_POKEGROWER_REQUEST
});

// Dispatched when pokemon data is successfully fetched
export const fetchPokeGrowerSuccess = (pokemonList) => {
    return {
        type: FETCH_POKEGROWER_SUCCESS,
        payload: money
    };
};

// Dispatched when there is an error fetching pokemon data
export const fetchPokeGrowerFailure = (error) => ({
    type: FETCH_POKEGROWER_FAILURE,
    payload: error
});

// Dispatched when updating pokemon favorite or isCaught status
export const pokeGrowerIncrement = (id, field, value) => {
    return (dispatch) => {
        // Update the state by dispatching the action
        dispatch({
            type: POKEGROWER_INCREMENT,
            payload: { money: value }
        });
    };
};