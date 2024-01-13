import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
const initialState = {};
const middleware = [thunk];
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store = createStore(
null,
initialState,
composeEnhancers(
applyMiddleware(...middleware)
)
);
export default store;