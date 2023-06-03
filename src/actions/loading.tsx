
import { SET_LOADING_TEXT, SET_QUESTIONS_COMPLETED } from './ActionTypes';

// Dispatched to update the loading text displayed on the loading screen
export const setLoadingText = (loadingText) => ({
    type: SET_LOADING_TEXT,
    payload: loadingText,
});

// Dispatched to indicate whether the questions on the loading screen have been answered
export const setQuestionsCompleted = (completed) => ({
    type: SET_QUESTIONS_COMPLETED,
    payload: completed,
});