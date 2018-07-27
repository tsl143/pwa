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
            url: 'https://api.myjson.com/bins/10c95u'
        }).then(questions => {
            return axios({
                //url: `${apiURL}/getAnswers?id=${channelid}`,
                url: 'https://api.myjson.com/bins/7rg4i'
            }).then(answers => ({ questions, answers }))
        }).catch(err => ({ err }))
    }
}