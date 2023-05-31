import { database } from '../utils/database';

// Abilities action creators
export const fetchAbilitiesRequest = () => ({
    type: 'FETCH_ABILITIES_REQUEST',
});

export const fetchAbilitiesSuccess = (abilitiesData) => {
    return {
        type: 'FETCH_ABILITIES_SUCCESS',
        payload: abilitiesData,
    };
};

export const fetchAbilitiesFailure = (error) => ({
    type: 'FETCH_ABILITIES_FAILURE',
    payload: error,
});