import axios from 'axios';
import Store from '../reducers/store';

const API = 'https://stark-chamber-45207.herokuapp.com/';
export function showLoader() {
    return {
        type: 'LOADER_FRNDS',
        payload: true
    };
}

export const getFriends = (authId = '') => {
    Store.dispatch(showLoader());
    return axios({
      method: 'GET',
      url: `${API}getFriends?id=${authId}`,
    })
    .then( response => {
        return {
            type: 'FRIENDS_LIST',
            payload: response
        }
    })
    .catch( error => {
        return {
            type: 'FRIENDS_LIST',
            payload: { data: 0, error }
        }
    } );
}

export const getFriendsCache = () => {
    return {
            type: 'FRIENDS_LIST_CACHE',
            payload: true
        }
}
