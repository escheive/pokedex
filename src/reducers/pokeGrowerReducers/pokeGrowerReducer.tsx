import { FETCH_POKEGROWER_REQUEST, FETCH_POKEGROWER_SUCCESS, FETCH_POKEGROWER_FAILURE, POKEGROWER_INCREMENT_CURRENCY } from '../../actions/pokeGrowerActions/pokeGrowerActionTypes';

// Define the initialState for Pokemon
const initialState = {
    loading: false, // Indicates whether the data is being fetched or not
    error: null, // Holds any error that occurs during the Pokemon fetch
    money: 1, // Holds the users money value
    income: 1, // Holds the user income value which determines money gained
    tickets: 1, // Value for catching new pokemon
    pokeBalls: 1, // Used to catch new pokemon
    stage: 1, // Holds value for what stage a user is on
    prestigePoints: 0,
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
            };
        case POKEGROWER_INCREMENT_CURRENCY:
            const { currency, amount } = action.payload
            return {
                ...state,
                [currency]: state[currency] + amount,
            };
        // Handle other actions here
        default:
            return state;
    }
};

export default pokeGrowerReducer;