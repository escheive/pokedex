
import { SET_USER_NAME, SET_USER_ID, UPDATE_USER_PROFILE } from '../actions/ActionTypes';

// Define the initialState for the users data
const initialState = {
    id: null, // Holds the users id
    name: '', // Holds the users name
    profileData: {}, // Holds more complex user info
};

const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_NAME:
            // Return the user state with updated name
            return {
                ...state,
                name: action.payload,
            };
        case SET_USER_ID:
            // Return the user state with updated id
            return {
                ...state,
                id: action.payload,
            };
        case UPDATE_USER_PROFILE:
            // Return the user state with updated profileData
            return {
                ...state,
                profileData: action.payload
            }
        // Handle other actions here
        default:
            return state;
    }
};

export default userReducer;