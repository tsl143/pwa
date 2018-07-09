import axios from 'axios';
import Store from '../reducers/store';
import botApiPayloads, {get_started} from '../shared/botApiPayloads'

const apiURL = 'https://temp.neargroup.me/ag'
export function showLoader() {
    return {
        type: 'LOADER_NOTIFICATION',
        payload: true
    };
}

// export function hitBotApi(data) {
//   console.log('in hitBotApi');
//   // axios({
//   //     method: 'POST',
//   //     url: `${BOT_API}`,
//   //     data
//   // })
//   // .then(response => {
//   //   console.log('hitBotApi response= ', response);
//   // })
//   return
// }

export const addBotData = (data) => {
  console.log('in addBotData = ', data);
    return {
            type: 'ADD_BOT_DATA',
            payload: data
        }
}

export function sendBotReply(data) {
  console.log('in sendBotReply ', data);
  let bot_payload = {}
  // let botData = {type: 'user_input', payload_type: 'get_started', text:""}
  switch (data.payload_type) {
    case "get_started":
      bot_payload = botApiPayloads.get_started
      // botData["text"] = "get started"
      break;
    case "normal_text":
      bot_payload = botApiPayloads.get_started
      // botData["text"] = ""
      break;
    default:

  }
  console.log('');

  // TODO: api with payload
  // hitBotApi(bot_payload)
  return addBotData(data)
}
