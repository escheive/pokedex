
// Pokemon action creators
export const fetchPokemonRequest = () => ({
    type: 'FETCH_POKEMON_REQUEST'
});

export const fetchPokemonSuccess = (pokemonList) => {
    return {
        type: 'FETCH_POKEMON_SUCCESS',
        payload: pokemonList
    };
};

export const fetchPokemonFailure = (error) => ({
    type: 'FETCH_POKEMON_FAILURE',
    payload: error
});

export const updatePokemon = (id, name) => ({
    type: 'UPDATE_POKEMON',
    payload: { id, name }
});