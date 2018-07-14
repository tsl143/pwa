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

export function hitBotApi(data) {
  console.log('in hitBotApi');
  return axios({
      method: 'POST',
      url: `${BOT_API}`,
      data
  })
  .then(response => {
    console.log('hitBotApi response= ', response);
    return {
            type: 'BLANK',
        }
  })
  return
}

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
  let userData = localStorage.getItem("NG_APP_SD_USER_DETAILS") != null ? JSON.parse(localStorage.getItem("NG_APP_SD_USER_DETAILS")) : {}
  // let botData = {type: 'user_input', payload_type: 'get_started', text:""}
  // return (dispatch, getState) => {
  //   let store = getState()
    // console.log('store in sendBotReply= ', store);
    switch (data.payload_type) {
      case "get_started":
        bot_payload = botApiPayloads.get_started
        // botData["text"] = "get started"
        bot_payload["senderObj"]["display"] = userData.name
        bot_payload["senderObj"]["channelid"] = userData.channelId
        bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
        bot_payload["contextObj"]["contextid"] = userData.channelId
        console.log("get-started bot_payload ", bot_payload);
        break;
      case "quick_reply":
        bot_payload = botApiPayloads.send_quick_reply
        bot_payload["messageObj"]["refmsgid"] = data.payload.msgid
        bot_payload["messageObj"]["text"] = data.payload.selectedOption
        bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
        bot_payload["senderObj"]["display"] = userData.name
        bot_payload["senderObj"]["channelid"] = userData.channelId
        bot_payload["contextObj"]["contextid"] = userData.channelId
        console.log("quick_reply bot_payload ", bot_payload);
        // botData["text"] = ""
        break;
      case "normal_text":
        console.log("normal_text bot_payload ", bot_payload);
        bot_payload = botApiPayloads.normal_text
        // bot_payload["messageObj"]["referralParam"] = data.payload.msgid
        bot_payload["messageObj"]["text"] = data.payload.selectedOption
        bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
        bot_payload["senderObj"]["display"] = userData.name
        bot_payload["senderObj"]["channelid"] = userData.channelId
        bot_payload["contextObj"]["contextid"] = userData.channelId
        // botData["text"] = ""
        break;
      case 'postback':
        console.log("postback bot_payload ", bot_payload);
        bot_payload = botApiPayloads.send_postback
        bot_payload["messageObj"]["refmsgid"] = data.payload.msgid
        bot_payload["messageObj"]["text"] = data.payload.selectedOption
        bot_payload["senderObj"]["userProfilePic"] = userData.imageUrl
        bot_payload["senderObj"]["display"] = userData.name
        bot_payload["senderObj"]["channelid"] = userData.channelId
        bot_payload["contextObj"]["contextid"] = userData.channelId
      default:

    }
  // }
  console.log('final bot_payload ', bot_payload);

  // TODO: api with payload
  return hitBotApi(bot_payload)
  // return addBotData(bot_payload)
}
