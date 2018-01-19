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
        headers: {
            'Content-Type': 'application/json'
          }
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
    if(typeof data === 'object') data.isRegistered = 1;
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

export const getFriendsCache = () => {
    return {
        type: 'FRIENDS_LIST_CACHE',
        payload: true
    }
}

export const getLastMsg = (id, msg) => {
    return {
        type: 'LAST_MSG',
        payload: { id, msg }
    }
}

export const setMeeting = meetingId => {
    return {
        type: 'SET_MEETING',
        payload: meetingId
    }
}
