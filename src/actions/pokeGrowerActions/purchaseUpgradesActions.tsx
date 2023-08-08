import { PURCHASE_UPGRADE } from './pokeGrowerActionTypes';

// Dispatched when updating pokemon favorite or isCaught status
export const purchaseUpgrade = (upgrade, amount) => {
    return (dispatch) => {
        // Update the state by dispatching the action
        dispatch({
            type: PURCHASE_UPGRADE,
            payload: { upgrade, amount }
        });
    };
};