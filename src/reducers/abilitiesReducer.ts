// abilitiesReducer.js

// Define the initial state for abilities
const initialState = {
    abilitiesData: null, // Holds the abilities data retrieved from the API
    loading: false, // Indicates whether abilities data is currently being fetched
    error: null, // Holds any error that occurred during the abilities data fetch
};


const abilitiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ABILITIES_REQUEST':
            // Set loading to true and clear any previous error
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_ABILITIES_SUCCESS':
            // Store the fetched abilities data and set loading to false
            return {
                ...state,
                abilitiesData: action.payload,
                loading: false,
            };
        case 'FETCH_ABILITIES_FAILURE':
            // Set loading to false and store the error that occurred during the fetch
            return {
                ...state,
                loading: false,
                error: action.payload,
            };
        default:
        return state;
    }
};

export default abilitiesReducer;
