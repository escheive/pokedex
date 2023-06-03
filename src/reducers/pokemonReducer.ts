import { FETCH_POKEMON_REQUEST, FETCH_POKEMON_SUCCESS, FETCH_POKEMON_FAILURE, UPDATE_POKEMON_STATUS } from '../actions/ActionTypes';

// Define the initialState for Pokemon
const initialState = {
    loading: false, // Indicates whether the data is being fetched or not
    error: null, // Holds any error that occurs during the Pokemon fetch
    pokemonList: [], // Holds the Pokemon data retrieved from the db or API
};


const pokemonReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_POKEMON_REQUEST:
            // Set loading to true and clear any previous errors
            return {
                ...state,
                loading: true,
                error: null,
            };
        case FETCH_POKEMON_SUCCESS:
            return {
                // Set loading to false and return the Pokemon data
                ...state,
                loading: false,
                error: null,
                pokemonList: action.payload,
            };
        case FETCH_POKEMON_FAILURE:
            // Set loading to false and store the error that occurred during the fetch
            return {
                ...state,
                loading: false,
                error: action.payload,
                pokemonList: [],
            };
        case UPDATE_POKEMON_STATUS:
            // Update the pokemon favorite or capture status on user press
            const { id, isFavorite, isCaptured } = action.payload;
            const updatedPokemonList = {
                ...state.pokemonList,
                [id]: {
                    ...state.pokemonList[id],
                    isFavorite: isFavorite !== undefined ? isFavorite : state.pokemonList[id].isFavorite,
                    isCaptured: isCaptured !== undefined ? isCaptured : state.pokemonList[id].isCaptured,
                }
            };
            return {
                ...state,
                pokemonList: updatedPokemonList
            };
        // Handle other actions here
        default:
            return state;
    }
};

export default pokemonReducer;