// export default {
//   "get_started" : {
//                     "nearGroupWeb": "webchat",
//                     "messageObj": {
//                       "referralParam": "<GET_STARTED_PAYLOAD>",
//                       "text": "startchattingevent",
//                       "type": "event"
//                     },
//                     "senderObj": {
//                       "display": "",
//                       "channeltype": "webchat",
//                       "pageId": "",
//                       "channelid": "",
//                       "subdisplay": "",
//                       "userProfilePic": "",
//                       "userLocation": "",
//                       "locale": "en_US"
//                     },
//                     "contextObj": {
//                       "botname": "rhtbot2",
//                       "contexttype": "p2p",
//                       "channeltype": "webchat",
//                       "contextid": "",
//                       "pageId": ""
//                     }
//                   },
//
// }

export const get_started = {
  "nearGroupWeb": "webchat",
  "messageObj": {
    "referralParam": "<GET_STARTED_PAYLOAD>",
    "text": "startchattingevent",
    "type": "event"
  },
  "senderObj": {
    "display": "Shailendra",
    "channeltype": "webchat",
    "pageId": "322287134931229",
    "channelid": "157883994219889433",
    "subdisplay": "",
    "userProfilePic": "https://xyz.com",
    "userLocation": "New Delhi",
    "locale": "en_US"
  },
  "contextObj": {
    "botname": "rhtbot2",
    "contexttype": "p2p",
    "channeltype": "webchat",
    "contextid": "157883994219889433",
    "pageId": "322287134931229"
  }
}


// {
//                     "nearGroupWeb": "webchat",
//                     "messageObj": {
//                       "referralParam": "<GET_STARTED_PAYLOAD>",
//                       "text": "startchattingevent",
//                       "type": "event"
//                     },
//                     "senderObj": {
//                       "display": "",
//                       "channeltype": "webchat",
//                       "pageId": "",
//                       "channelid": "",
//                       "subdisplay": "",
//                       "userProfilePic": "",
//                       "userLocation": "",
//                       "locale": "en_US"
//                     },
//                     "contextObj": {
//                       "botname": "rhtbot2",
//                       "contexttype": "p2p",
//                       "channeltype": "webchat",
//                       "contextid": "",
//                       "pageId": ""
//                     }
//                   }

export const postback = {
    "recipient": {
        "id": "1578839942198894"
    },
    "message": {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Pls wait... I\u0027m searching 🔎 for a suitable girl for you near Manila 😍 \n\nI will notify you when I find your match 😇\n\nMeanwhile, complete your profile in SETTINGS so you can get the best matches! 👇",
                "buttons": [{
                    "type": "web_url",
                    "title": "Settings",
                    "url": "https://ng.neargroup.in/ng/editprofile.html?channelid\u003d58d6d3e420214ba8b2df1f9fbca3ffef\u0026callback\u003dYesProceed\u0026close\u003d123",
                    "webview_share_button": "hide"
                }]
            }
        },
        "quick_replies": [{
            "content_type": "text",
            "title": "End Searching",
            "payload": "superchat$$$"
        }]
    }
}

export const postback_quickreply = {
    "recipient": {
        "id": "1578839942198894"
    },
    "message": {
        "attachment": {
            "type": "template",
            "payload": {
                "template_type": "button",
                "text": "Welcome to NG MENU\n\nDo you prefer to chat now?",
                "buttons": [{
                    "type": "web_url",
                    "title": "Coins",
                    "url": "https://pay.neargroup.me/?channelId\u003dbc2a2b7707b64d10940a0bbd79a7f9ae",
                    "webview_height_ratio": "tall",
                    "messenger_extensions": "false",
                    "webview_share_button": "hide"
                }, {
                    "type": "postback",
                    "title": "Settings",
                    "payload": "{\"refmsgid\":\"qr_212\",\"text\":\"Settings\"}",
                    "webview_height_ratio": "tall",
                    "webview_share_button": "hide"
                }]
            }
        },
        "quick_replies": [{
            "content_type": "text",
            "title": "Chat Now",
            "payload": "",
            "image_url": "https://s3-us-west-2.amazonaws.com/ng-utilities-images/icon_instant_chat.png"
        }, {
            "content_type": "text",
            "title": "Try New Apps",
            "payload": "",
            "image_url": ""
        }, {
            "content_type": "text",
            "title": "Rate Us",
            "payload": "",
            "image_url": "https://s3-us-west-2.amazonaws.com/ng-utilities-images/icon_feedback.png"
        }]
    }
}

export const quick_reply = {
    "type": "quick_reply",
    "content": {
        "type": "text",
        "text": "Whom would you like to chat with?\n\n1. Female\n2. Male\n3. Anyone\n\nType a number below 👇"
    },
    "msgid": "qr_212",
    "options": [{
        "type": "text",
        "title": "Female",
        "iconurl": "https://s3-us-west-2.amazonaws.com/ng-utilities-images/icon_girl.png"
    }, {
        "type": "text",
        "title": "Male",
        "iconurl": "https://s3-us-west-2.amazonaws.com/ng-utilities-images/icon_boy.png"
    }, {
        "type": "text",
        "title": "Anyone (Just Friend)",
        "iconurl": "https://s3-us-west-2.amazonaws.com/ng-utilities-images/icon_anyone.png"
    }]
}

export const survey = {
    "type": "survey",
    "question": "Pls wait... I\u0027m searching 🔎 for a suitable Girl for you near Manila 😍 \n\nI will notify you when I find your match 😇\n\nMeanwhile, complete your profile in SETTINGS so you can get the best matches! 👇",
    "msgid": "qr_212",
    "options": [{
        "type": "url",
        "title": "Settings",
        "url": "https://ng.neargroup.in/ng/editprofile.html?channelid\u003d58d6d3e420214ba8b2df1f9fbca3ffef\u0026callback\u003dYesProceed\u0026close\u003d123",
        "messenger_extensions": "false"
    }]
}

export const send_quick_reply = {
  "nearGroupWeb": "webchat",
  "messageObj": {
    "referralParam": "",
    "refmsgid": "qr_212", // msgid
    "text": "Female", // user input
    "type": "msg"
  },
  "senderObj": {
    "userProfilePic": "", // imageUrl
    "display": "", //name
    "channeltype": "webchat",
    "userLocation": "",
    "pageId": "322287134931229", // unique ng web id
    "locale": "",
    "channelid": "", //user channelId
    "subdisplay": ""
  },
  "contextObj": {
    "botname": "rhtbot2",
    "contexttype": "p2p",
    "channeltype": "webchat",
    "contextid": "", //channelId
    "pageId": "322287134931229" // unique ng web id
  }
}

export const send_postback = {
  "nearGroupWeb": "webchat",
  "messageObj": {
    "refmsgid": "EP$$$",
    "text": "",
    "type": "msg"
  },
  "senderObj": {
    "userProfilePic": "",
    "display": "",
    "channeltype": "webchat",
    "userLocation": "",
    "pageId": "322287134931229",
    "locale": "",
    "channelid": "",
    "subdisplay": ""
  },
  "contextObj": {
    "botname": "rhtbot2",
    "contexttype": "p2p",
    "channeltype": "webchat",
    "contextid": "",
    "pageId": "322287134931229"
  }
}

export const normal_text = {
  "nearGroupWeb": "webchat",
  "messageObj": {
    "referralParam": "",
    "text": "",
    "type": "msg"
  },
  "senderObj": {
    "userProfilePic": "",
    "display": "",
    "channeltype": "webchat",
    "userLocation": "",
    "pageId": "322287134931229",
    "locale": "",
    "channelid": "",
    "subdisplay": ""
  },
  "contextObj": {
    "botname": "rhtbot2",
    "contexttype": "p2p",
    "channeltype": "webchat",
    "contextid": "",
    "pageId": "322287134931229"
  }
}

export default {get_started, normal_text, postback, postback_quickreply, quick_reply, survey, send_quick_reply, send_postback}
