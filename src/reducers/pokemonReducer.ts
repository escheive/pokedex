
// Initial State
const initialState = {
    loading: false,
    error: null,
    pokemonList: [],
};

// Pokemon Reducer
const pokemonReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'FETCH_POKEMON_REQUEST':
            return {
                ...state,
                loading: true,
                error: null,
            };
        case 'FETCH_POKEMON_SUCCESS':
            return {
                ...state,
                loading: false,
                error: null,
                pokemonList: action.payload,
            };
        case 'FETCH_POKEMON_FAILURE':
            return {
                ...state,
                loading: false,
                error: action.payload,
                pokemonList: [],
            };
        case 'UPDATE_POKEMON':
            const updatedPokemonList = state.pokemonList.map(pokemon => {
                if (pokemon.id === action.payload.id) {
                    return {
                        ...pokemon,
                        isFavorite: action.payload.isFavorite != undefined ? action.payload.isFavorite : pokemon.isFavorite,
                        isCaptured: action.payload.isCaptured != undefined ? action.payload.isCaptured : pokemon.isCaptured
                    };
                }
                return pokemon;
            });
            return {
                ...state,
                pokemonList: updatedPokemonList,
            };
        default:
            return state;
    }
};

export default pokemonReducer;