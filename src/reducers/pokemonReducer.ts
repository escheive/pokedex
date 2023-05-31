
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
        case 'UPDATE_POKEMON_FAVORITE_STATUS':
            const { id, isFavorite } = action.payload;
            const updatedPokemonList = state.pokemonList.map((pokemon) => {
                if (pokemon.id === id) {
                    return { ...pokemon, isFavorite };
                }
                return pokemon;
            });
            return {
                ...state,
                pokemonList: updatedPokemonList
            };
        case 'UPDATE_POKEMON_CAPTURE_STATUS':
            return {
                ...state,
                pokemonList: pokemonList
            }
        default:
            return state;
    }
};

export default pokemonReducer;