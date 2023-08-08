import { PURCHASE_UPGRADE } from '../../actions/pokeGrowerActions/pokeGrowerActionTypes';

// Define the initialState for Pokemon
const initialState = {
    loading: false, // Indicates whether the data is being fetched or not
    error: null, // Holds any error that occurs during the Pokemon fetch
    pokeballs: 0, // Tracks purchase pokeballs
};


const purchasedUpgradesReducer = (state = initialState, action) => {
    switch (action.type) {
        case PURCHASE_UPGRADE:
            const { upgrade, amount } = action.payload
            return {
                ...state,
                [upgrade]: state[upgrade] + amount,
            };
        // Handle other actions here
        default:
            return state;
    }
};

export default purchasedUpgradesReducer;