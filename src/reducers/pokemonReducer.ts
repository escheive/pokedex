
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
        case 'UPDATE_POKEMON_STATUS':
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
//         case 'UPDATE_POKEMON_CAPTURE_STATUS':
//             const { id: captureId, isCaptured } = action.payload;
//             const updatedCaptureList = {
//                 ...state.pokemonList,
//                 [captureId]: {
//                     ...state.pokemonList[captureId],
//                     isCaptured
//                 }
//             };
//             return {
//                 ...state,
//                 pokemonList: updatedCaptureList
//             }
//         case 'UPDATE_POKEMON_FAVORITE_STATUS':
//             const { id, isFavorite } = action.payload;
//             const updatedPokemonList = {
//                 ...state.pokemonList,
//                 [id]: {
//                     ...state.pokemonList[id],
//                     isFavorite
//                 }
//             };
//             return {
//                 ...state,
//                 pokemonList: updatedPokemonList
//             };
//         case 'UPDATE_POKEMON_CAPTURE_STATUS':
//             const { id: captureId, isCaptured } = action.payload;
//             const updatedCaptureList = {
//                 ...state.pokemonList,
//                 [captureId]: {
//                     ...state.pokemonList[captureId],
//                     isCaptured
//                 }
//             };
//             return {
//                 ...state,
//                 pokemonList: updatedCaptureList
//             }
        default:
            return state;
    }
};

export default pokemonReducer;