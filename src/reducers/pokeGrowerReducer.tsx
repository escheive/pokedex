import { FETCH_POKEGROWER_REQUEST, FETCH_POKEGROWER_SUCCESS, FETCH_POKEGROWER_FAILURE, POKEGROWER_INCREMENT } from '../actions/ActionTypes';

// Define the initialState for Pokemon
const initialState = {
    loading: false, // Indicates whether the data is being fetched or not
    error: null, // Holds any error that occurs during the Pokemon fetch
    money: 1, // Holds the money value
};


const pokeGrowerReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_POKEGROWER_REQUEST:
            // Set loading to true and clear any previous errors
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_POKEGROWER_SUCCESS:
            return {
                // Set loading to false and return the PokeGrower data
                ...state,
                loading: false,
                error: null,
                money: action.payload,
            };
        case FETCH_POKEGROWER_FAILURE:
            // Set loading to false and store the error that occurred during the fetch
            return {
                ...state,
                loading: false,
                error: action.payload,
                money: 'error',
            };
        case POKEGROWER_INCREMENT:
            // Increment PokeGrower money
            const updatedMoney = state.money + 1
            return {
                ...state,
                money: updatedMoney
            };
        // Handle other actions here
        default:
            return state;
    }
};

export default pokeGrowerReducer;