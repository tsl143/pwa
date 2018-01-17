import axios from 'axios';
import Store from '../reducers/store';

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
    });
}

export const sendPush = data => {
    return axios({
        method: 'POST',
        url: `${API}notifyUser`,
        data
    })
    .then( response => {
        return {
            type: 'SENT',
            payload: response
        }
    });
}

export const getLastMsg = id => {
    return firebase.database().ref(`/rooms/${id}`)
    .limitToLast(1)
    .once('value', snap => {
        const value = snap.val();
        const msg = value[Object.keys(value)[0]]
        return {
            type: 'LAST_MSG',
            payload: {
                id,
                msg
            }
        }
    });
}

export const getFriendsCache = () => {
    return {
            type: 'FRIENDS_LIST_CACHE',
            payload: true
        }
}
