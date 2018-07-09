import axios from 'axios';
import Store from '../reducers/store';

const apiURL = 'https://temp.neargroup.me/ag'
export function showLoader() {
    return {
        type: 'LOADER_NOTIFICATION',
        payload: true
    };
}

// export const getNotifications = (channelid = '2c4049be7a41473d8b743a816bed041b') => {
//     Store.dispatch(showLoader());
//     const data = { channelid };
//     return axios({
//       method: 'POST',
//       url: `${apiURL}/myNotification`,
//       data
//     })
//     .then( response => {
//         return {
//             type: 'NOTIFICATIONS',
//             payload: response
//         }
//     })
//     .catch( error => {
//         return {
//             type: 'NOTIFICATIONS',
//             payload: { data: 0, error }
//         }
//     } );
// }

export const saveChannelId = (data) => {
    return {
            type: 'SAVE_CHANNELID',
            payload: data
        }
}

export const saveLoginSession = (data) => {
    return {
            type: 'SAVE_LOGIN',
            payload: data
        }
}

export const addBotData = (data) => {
    return {
            type: 'ADD_BOT_DATA',
            payload: data
        }
}



export const saveLocation = (data) => {
    return {
            type: 'SAVE_LOCATION',
            payload: data
        }
}

export const saveFCMtoken = (data) => {
  console.log('in saveFCMtoken ', data);
    return {
            type: 'SAVE_FCM_TOKEN',
            payload: data
        }
}

export const saveOnboardingData = (data) => {
    return {
            type: 'SAVE_ONBOARDING',
            payload: data
        }
}
