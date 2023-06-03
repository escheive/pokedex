import { database } from '../utils/database';
import { FETCH_ABILITIES_REQUEST, FETCH_ABILITIES_SUCCESS, FETCH_ABILITIES_FAILURE } from './ActionTypes';

// Dispatched when requesting abilities data
export const fetchAbilitiesRequest = () => ({
    type: FETCH_ABILITIES_REQUEST,
});

// Dispatched when abilities data is successfully fetched
export const fetchAbilitiesSuccess = (abilitiesData) => {
    return {
        type: FETCH_ABILITIES_SUCCESS,
        payload: abilitiesData,
    };
};

// Dispatched when there is an error fetching abilities data
export const fetchAbilitiesFailure = (error) => ({
    type: FETCH_ABILITIES_FAILURE,
    payload: error,
});