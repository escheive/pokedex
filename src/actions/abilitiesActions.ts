
// Abilities action creators
export const fetchAbilitiesRequest = () => ({
    type: FETCH_ABILITIES_REQUEST,
});

export const fetchAbilitiesSuccess = (abilitiesData) => ({
    type: FETCH_ABILITIES_SUCCESS,
    payload: abilitiesData,
});

export const fetchAbilitiesFailure = (error) => ({
    type: FETCH_ABILITIES_FAILURE,
    payload: error,
});