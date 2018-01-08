import axios from 'axios';
import Store from '../reducers/store';

const apiURL = 'https://temp.neargroup.me/ag'
export function showLoader() {
    return {
        type: 'LOADER_FRNDS',
        payload: true
    };
}

export const getFriends = (channelid = '2c4049be7a41473d8b743a816bed041b') => {
    Store.dispatch(showLoader());
    const data = { channelid };
    return axios({
      method: 'POST',
      url: `${apiURL}/frndlist`,
      data
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
