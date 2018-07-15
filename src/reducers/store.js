import { createStore, applyMiddleware } from 'redux';
import ReduxPromise from 'redux-promise';
import thunk from 'redux-thunk';

import { combineReducers } from 'redux';
import friends from './friends';
import notification from './notification';
import settings from './settings';
import login from './login';

const reducers = combineReducers({
    friends: friends,
    notifications: notification,
    login: login,
    settings
});

const createStoreWithMiddleware = applyMiddleware(ReduxPromise, thunk)(createStore);
const store = createStoreWithMiddleware(reducers);

export default store;
