import axios from 'axios';
import Store from '../reducers/store';

const apiURL = 'https://temp.neargroup.me/ag'
export function showLoader() {
    return {
        type: 'SHOW_LOADER',
        payload: true
    };
}

export const getQuestions = (channelid = '040f6a5ff54643e0ab24795e3f426766') => {
    Store.dispatch(showLoader());
    return {
        type: 'QUESTIONS',
        payload: axios({
            //url: `${apiURL}/getQuestions?id=${channelid}`,
            url: 'http://192.168.1.6:8081/q.json'
        }).then(questions => {
            return axios({
                //url: `${apiURL}/getAnswers?id=${channelid}`,
                url: 'http://192.168.1.6:8081/a.json'
            }).then(answers => ({ questions, answers }))
        }).catch(err => ({ err }))
    }
}