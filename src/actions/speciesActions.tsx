import { FETCH_SPECIES_REQUEST, FETCH_SPECIES_SUCCESS, FETCH_SPECIES_FAILURE } from './ActionTypes';

// Dispatched when requesting moves data
export const fetchSpeciesRequest = () => ({
    type: FETCH_SPECIES_REQUEST,
});

// Dispatched when moves data is successfully fetched
export const fetchSpeciesSuccess = (speciesData) => {
    return {
        type: FETCH_SPECIES_SUCCESS,
        payload: speciesData,
    };
};

// Dispatched when there is an error fetching moves data
export const fetchSpeciesFailure = (error) => ({
    type: FETCH_SPECIES_FAILURE,
    payload: error,
});