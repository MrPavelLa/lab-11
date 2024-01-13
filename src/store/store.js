// store.js
// import { createStore } from 'redux';
// import rootReducer from './reducers/rootReducer';

// const store = createStore(rootReducer);

// export default store;

// import { configureStore } from '@reduxjs/toolkit';

// import codeReducer from './reducers/codeReducer';
// import roleReducer from './reducers/roleReducer';

// const store = configureStore({
//   reducer: {
//     role: roleReducer,
//     code: codeReducer,
//   },
// });

// export default store;


import {createStore } from 'redux';

import rootReducer from './reducers/rootReducer';

// const rootReducer = combineReducers({ 
//     roleReducer,
//     codeReducer,
// });

const store = createStore(rootReducer);

export default store;

