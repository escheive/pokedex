import { FETCH_MOVES_REQUEST, FETCH_MOVES_SUCCESS, FETCH_MOVES_FAILURE } from './ActionTypes';

// Dispatched when requesting moves data
export const fetchMovesRequest = () => ({
    type: FETCH_MOVES_REQUEST,
});

// Dispatched when moves data is successfully fetched
export const fetchMovesSuccess = (movesData) => {
    return {
        type: FETCH_MOVES_SUCCESS,
        payload: movesData,
    };
};

// Dispatched when there is an error fetching moves data
export const fetchMovesFailure = (error) => ({
    type: FETCH_MOVES_FAILURE,
    payload: error,
});