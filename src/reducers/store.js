import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';

import { combineReducers } from 'redux';
import NG from './ng';

const reducers = combineReducers({
    ng: NG
});

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const store = createStoreWithMiddleware(reducers);

export default store;
