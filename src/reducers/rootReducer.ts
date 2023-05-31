import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunk from 'redux-thunk';
import pokemonReducer from './pokemonReducer';

const rootReducer = combineReducers({
    pokemon: pokemonReducer,
    // Add other reducers here
});

export default rootReducer;
// export default rootReducer;
// const store = createStore(rootReducer, applyMiddleware(thunk));