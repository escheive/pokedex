import { database, updatePokemonFavoriteStatus, updatePokemonCaptureStatus, updatePokemonStatus } from '../utils/database';

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

// export const updatePokemonFavoriteStatusAction = (id, isFavorite) => {
//     return (dispatch) => {
//         // Update the state by dispatching the action
//         dispatch({
//             type: 'UPDATE_POKEMON_FAVORITE_STATUS',
//             payload: { id, isFavorite }
//         });
//
//         // Update the database using the database update function
//         updatePokemonFavoriteStatus(id, isFavorite);
//     };
// };
//
// export const updatePokemonCaptureStatusAction = (id, isCaptured, database) => {
//     return (dispatch) => {
//         // Update the state by dispatching the action
//         dispatch({
//             type: 'UPDATE_POKEMON_CAPTURE_STATUS',
//             payload: { id, isCaptured }
//         });
//
//         // Update the database using the database update function
//         updatePokemonCaptureStatus(database, id, isCaptured);
//     };
// };

export const updatePokemonStatusAction = (id, field, value) => {
    return (dispatch) => {

        // Update the state by dispatching the action
        dispatch({
            type: 'UPDATE_POKEMON_STATUS',
            payload: { id, [field]: value }
        });

        // Update the database using the database update function
        updatePokemonStatus(id, field, value)
    };
};