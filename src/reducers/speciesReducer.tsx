import { FETCH_SPECIES_REQUEST, FETCH_SPECIES_SUCCESS, FETCH_SPECIES_FAILURE } from '../actions/ActionTypes';

// Define the initial state for species
const initialState = {
    speciesData: null, // Holds the species data retrieved from the API
    loading: false, // Indicates whether species data is currently being fetched
    error: null, // Holds any error that occurred during the species data fetch
};


const speciesReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_SPECIES_REQUEST:
            // Set loading to true and clear any previous error
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_SPECIES_SUCCESS:
            // Store the fetched species data and set loading to false
            return {
                ...state,
                speciesData: action.payload,
                loading: false,
            };
        case FETCH_SPECIES_FAILURE:
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

export default speciesReducer;