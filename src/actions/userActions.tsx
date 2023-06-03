import { SET_USER_NAME, SET_USER_ID, UPDATE_USER_PROFILE } from './ActionTypes';

// Dispatched to set or update the users name
export const setUserName = (name) => ({
    type: SET_USER_NAME,
    payload: name,
});

// Dispatched to set or update the users id
export const setUserId = (id) => ({
    type: SET_USER_ID,
    payload: id,
});

// Dispatched for more complex user updates
export const updateUserProfile = (profileData) => ({
    type: UPDATE_USER_PROFILE,
    payload: profileData,
});