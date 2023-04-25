import { combineReducers } from 'redux';

// importe seus reducers aqui
import chatReducer from './duck/chat';

const rootReducer = combineReducers({
  chat: chatReducer,
});

export default rootReducer;