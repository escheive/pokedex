import { FETCH_ABILITIES_REQUEST, FETCH_ABILITIES_SUCCESS, FETCH_ABILITIES_FAILURE } from '../actions/ActionTypes';

// Define the initial state for abilities
const initialState = {
    movesData: null, // Holds the abilities data retrieved from the API
    loading: false, // Indicates whether abilities data is currently being fetched
    error: null, // Holds any error that occurred during the abilities data fetch
};


const movesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MOVES_REQUEST:
            // Set loading to true and clear any previous error
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_MOVES_SUCCESS:
            // Store the fetched moves data and set loading to false
            return {
                ...state,
                movesData: action.payload,
                loading: false,
            };
        case FETCH_MOVES_FAILURE:
            // Set loading to false and store the error that occurred during the fetch
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        // Handle other actions here
        default:
            return state;
    }
};

export default movesReducer;
