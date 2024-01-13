// rootReducer.js
import { combineReducers } from 'redux';
import codeReducer from './codeReducer';
import roleReducer from './roleReducer';

const rootReducer = combineReducers({
  code: codeReducer,
  role: roleReducer,
});

export default rootReducer;


