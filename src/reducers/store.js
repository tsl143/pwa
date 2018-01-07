import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';

import { combineReducers } from 'redux';
import friends from './friends';
import notification from './notification';

const reducers = combineReducers({
    friends: friends,
    notifications: notification
});

const createStoreWithMiddleware = applyMiddleware(ReduxPromise)(createStore);
const store = createStoreWithMiddleware(reducers);

export default store;
