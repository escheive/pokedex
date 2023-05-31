// abilitiesReducer.js

// Define the initial state for abilities
const initialState = {
    abilitiesData: null,
    loading: false,
    error: null,
};

// Define the abilities reducer function
const abilitiesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_ABILITIES_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_ABILITIES_SUCCESS':
            return {
                ...state,
                abilitiesData: action.payload,
                loading: false,
            };
        case 'FETCH_ABILITIES_FAILURE':
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
