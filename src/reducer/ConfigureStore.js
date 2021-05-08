import { createStore, applyMiddleware, combineReducers } from 'redux';
import createLogger from 'redux-logger';
import AppraisalNewReducer from './modules/AppraisalNewReducer';
import ConfigReducer from './modules/ConfigReducer';
import ModifyReducer from './modules/ModifyReducer';
import thunkMiddleware from 'redux-thunk';
const loggerMiddleware = createLogger(); // initialize logger

const createStoreWithMiddleware = applyMiddleware(loggerMiddleware, thunkMiddleware)(createStore); // apply logger to redux

const reducer = combineReducers({
  appraisal: AppraisalNewReducer,
  config: ConfigReducer,
  modify: ModifyReducer
});

const configureStore = (initialState) => createStoreWithMiddleware(reducer, initialState);
export default configureStore;