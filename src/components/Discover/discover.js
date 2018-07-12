import React, {Component} from 'react'
import { connect } from 'react-redux';
import { withStyles } from '@material-ui/core/styles';
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import ActionSend from "material-ui/svg-icons/content/send";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import TextField from "material-ui/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import { cyan500 } from "material-ui/styles/colors";
import Fontawesome from 'react-fontawesome'
import botApiPayloads, {get_started} from '../../shared/botApiPayloads'
import {addBotData, sendBotReply } from '../../actions/discover';
import { htmlDecode, formatTime, formatDate } from '../../utility';
import { Twemoji } from "react-emoji-render";

console.log("botApiPayloads= ", botApiPayloads, get_started);
import Styles from './style.scss';
console.log("Styles in discover= ", Styles);


const styles = (theme) => ({
  stepper: {
    width: '100vw',
    flexGrow: 1,
    bottom: 0,
    position: 'absolute'
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  menu: {
    width: 200,
  },
  input: {
    display: 'none',
  },
  getStarted: {
    bottom: 0,
    position: "absolute",
    width: "100vw",
    textAlign: "center",
  },
  button: {
    margin: theme.spacing.unit,
    backgroundColor: "#3f51b5",
    color: 'white'
  },

});

class Discover extends Component {
  constructor(props) {
    super(props)
    this.state = {
      botData: [],
      message: '',
    }

    this.sendPlz = this.sendPlz.bind(this)
    this.handleMsg = this.handleMsg.bind(this)
    this.handleGetStarted = this.handleGetStarted.bind(this)
    this.startListening = this.startListening.bind(this)
    this.handleChildAdd = this.handleChildAdd.bind(this)
    this.handleNormalText = this.handleNormalText.bind(this)
  }

  componentDidMount() {
    console.log("Discover will mount");
    // var resource = document.createElement('link');
    // resource.setAttribute("rel", "stylesheet");
    // resource.setAttribute("href","https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css");
    // resource.setAttribute("type","text/css");
    // var head = document.getElementsByTagName('head')[0];
    // head.appendChild(resource);
    let userData = localStorage.getItem("NG_APP_SD_USER_DETAILS") != null ? JSON.parse(localStorage.getItem("NG_APP_SD_USER_DETAILS")) : {}
    this.startListening(userData.channelId)
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps  Discover = ', nextProps);
    if(nextProps.botData != this.props.botData) {
      console.log('setState botData');
      this.setState({botData: nextProps.botData}, () => {
        console.log('botData state set -- ', this.state);
      })
    }
    // this.setState({onboardingData: nextProps.onboardingData})
    if(nextProps.channelId && nextProps.channelId != "") {
      // this.startListening(nextProps.channelId)
    }
  }

  startListening(channelId) {
		console.log('in startListening -- ', channelId);
		// const {data, fromId} = this.props;

		//intercepts for any new message from firebase with check of lastchatId
		// if (lastChat && lastChat.id) {
		// 	firebase
		// 		.database()
		// 		.ref(`/rooms/${data.meetingId}`)
		// 		.orderByKey()
		// 		.startAt(lastChat.id)
		// 		.on('child_added', snapshot => this.handleChildAdd(snapshot, lastChat));
    //
		// } else {
			firebase
				.database()
				.ref(`/bot_chat_rooms/${channelId}`)
				.on('child_added', snapshot => this.handleChildAdd(snapshot));
		// }

		// firebase.database()
		// .ref(`/isOnline/${data.channelId}`)
		// .on("child_changed", snapshot => {
		// 	const isOtherOnline = snapshot.val();
		// 	if(isOtherOnline!==null && typeof isOtherOnline !== 'undefined') this.props.setItems('isOtherOnline', data.channelId, isOtherOnline);
		// });
    //
		// firebase.database()
		// .ref(`/lastSeen/${data.channelId}`)
		// .on("child_changed", snapshot => {
		// 	const friendsLastSeen = snapshot.val();
		// 	if(friendsLastSeen) this.props.setItems('friendsLastSeen', data.channelId, friendsLastSeen);
		// });

		// this.props.addChildListener(data.meetingId);
	}

  handleChildAdd(snapshot, lastChat) {
    var data = snapshot.val();
		console.log('handleChildAdd = ', data, lastChat, this.props.channelId);
    var msg = data.msg
    let dataType = 'string'
    if(data.msg.charAt(0) == '{') {
      console.log("data.msg from firebase is json");
      var msg = JSON.parse(decodeURIComponent(data.msg))
      dataType = 'object'
    }
    console.log('msg parse= ', msg);
    this.checkInputType(msg, dataType)  //quick_reply quick_reply postback

		// const msgId = snapshot.key;
		// console.log('msg in handleChildAdd= ', msg);
		// msg.id = msgId;
		// if (
		// 	(lastChat && lastChat.id && lastChat.id === msgId) ||
		// 	(msg.fromId === this.props.fromId &&
		// 	parseInt(msg.sentTime, 10) > this.state.sentTime)
		// ) {
		// 	return true;
		// } else {
		// 	console.log("set and store chat on handleChildAdd");
		// 	this.setChat(msg);
		// 	this.storeChat(msg);
		// }
	}

  handleGetStarted(e) {
    console.log('handleGetStarted');
    let getStartedPayload = botApiPayloads.get_started
    this.props.addBotData({elem_type: 'user_input', payload_type: 'get_started', text:"get started"})
    this.props.sendBotReply({elem_type: 'user_input', payload_type: 'get_started'})

    // TODO: remove below statement..only for testing
    // this.checkInputType(botApiPayloads.postback_quickreply)  //quick_reply quick_reply postback
  }

  handleNormalText(data) {
    console.log('-- handleNormalText --');
  }

  handlePostback(data) {
    console.log('-- handlePostback --');
  }

  handleQuickReply(data) {
    console.log('-- handleQuickReply --');
  }

  handleMsg(e) {
    console.log('handleMsg -- ', e);
    this.setState({message: e.target.value})
  }

  checkInputType(data, dataType) {
    console.log('in checkInputType');
    console.log('checkInputType dataType == ', dataType);
    let payload

    if(dataType === "string") {
      this.props.addBotData({elem_type: 'bot_input', payload_type: 'text', text: data})
    } else {

      if("recipient" in data) {
        let {attachment, quick_replies} = data.message
        console.log('firebase input contains reciepient');
        switch (attachment.type) {
          case 'template':
            this.props.addBotData({...data, elem_type: 'bot_input', payload_type: 'postback', text: attachment.payload.text, quick_replies: quick_replies})
            break;
          default:

        }
      } else {
        console.log('firebase input NOT contains reciepient');
        switch (data.type) {
          case "survey":
            console.log("input type SURVEY");
            // payload = botApiPayloads.survey
            this.props.addBotData({...data, elem_type: 'bot_input', payload_type: 'survey', text: data.question, options: data.options})
            break;
          case "quick_reply":
            console.log("input type SURVEY");
            // payload = botApiPayloads.survey
            this.props.addBotData({...data, elem_type: 'bot_input', payload_type: 'quick_reply', text: data.content.text, options: data.options})
            break;
          default:

        }
      }
    }
  }

  sendPlz(e) {
    let {message} = this.state
    console.log('send action -- ', e, message);
    if(message == "") return false
    this.props.addBotData({elem_type: 'user_input', payload_type: 'normal_text', text: message})
    this.props.sendBotReply({type: 'user_input', payload_type: 'normal_text', payload: message})
    this.setState({message: ''})
  }

  handleOptionsClick(e, option, data) {
    e.preventDefault()
    let {type} = data  //content_type
    let content_type = ''
    if(option.type != undefined && option.type != 'text') type = option.type
    console.log('handleOptionsClick- ', option, data, type);
    switch (type) {
      case "quick_reply":
        if(typeof option != 'string') {
          if(option.type != undefined) content_type = option.type
          if(option.content_type != undefined) content_type = option.content_type
        }
        console.log('options content_type= ', content_type);
        if(typeof option == 'string') {
          console.log('option string');
          this.props.addBotData({elem_type: 'user_input', payload_type: type, text: option})
          this.props.sendBotReply({elem_type: 'user_input', payload_type: type, payload: {...data, selectedOption: option}})
        }
        else if(content_type == 'url' || content_type == 'web_url') {
          console.log('option -- ', content_type);
          window.location = option.url
        }
        else if( content_type == 'text' ) {
          console.log('option -- ', content_type);
          this.props.addBotData({elem_type: 'user_input', payload_type: 'quick_reply', text: option.title, icon: option.image_url})
          this.props.sendBotReply({elem_type: 'user_input', payload_type: 'quick_reply', payload: {...data, selectedOption: option.title}})
        }
        break;
        case 'postback':
          if(typeof option != 'string') {
            if(option.type != undefined) content_type = option.type
            if(option.content_type != undefined) content_type = option.content_type
          }
          console.log('options content_type= ', content_type);
          if(typeof option == 'string') {
            console.log('option string');
            this.props.addBotData({elem_type: 'user_input', payload_type: type, text: option})
            this.props.sendBotReply({elem_type: 'user_input', payload_type: type, payload: {...data, selectedOption: option}})
          }
          else if(content_type == 'url' || content_type == 'web_url') {
            console.log('option -- ', content_type);
            window.location = option.url
          }
          else if( content_type == 'text' ) {
            console.log('option -- ', content_type);
            this.props.addBotData({elem_type: 'user_input', payload_type: type, text: option.title, icon: option.image_url})
            this.props.sendBotReply({elem_type: 'user_input', payload_type: type, payload: {...data, selectedOption: option.title}})
          }
          else if( content_type == 'postback') {
            console.log('option -- ', content_type);
            this.props.addBotData({elem_type: 'user_input', payload_type: type, text: option.title})
            this.props.sendBotReply({elem_type: 'user_input', payload_type: type, payload: {...data, postback: option.postback, selectedOption: option.title}})
          }

      default:

    }

    // if(type == 'url' || type == 'web_url') {
    //   console.log('option -- ', type);
    //   window.location = data.url
    // } else if( type == 'text' ) {
    //   console.log('option -- ', type);
    //   this.props.addBotData({type: 'user_input', payload_type: 'quick_reply', text: data.title, icon: data.image_url})
    // } else if(content_type == 'text') {
    //   this.props.addBotData({type: 'user_input', payload_type: 'postback', text: data.title, icon: data.image_url})
    // }

  }

  render() {
    console.log("state in render= ", this.state);
    const { classes, theme } = this.props;
    const { botData } = this.state


    return (
      <div >
        {
          botData.length > 0 ?
          <div>
            <div className={Styles.ChatBox} id="chatBox">
              {
                botData.map((item, index) => {
                  let botDataOptions = "options" in item ? item.options.length > 0 : false
                  let showQuickReplies = "quick_replies" in item ? item.quick_replies.length > 0 : false

                  console.log('botData render map= ', item, index);

                  return (<div key={index} className={item.elem_type == "user_input" ? Styles.self : ""}>
                    <div><span className={Styles.chatlet}><Twemoji text={htmlDecode(item.text)} /></span></div>
                    {
                      botDataOptions &&
                      item.options.map((option, index) => {
                        if(typeof option == 'string') {
                          console.log("typeof option= ", "string", option);
                          return (<span key={index}>
                            <Button variant="contained" className={classes.button} onClick={(e) => this.handleOptionsClick(e, option, item)}>
                            {option}
                            </Button>
                            </span>)
                        } else {
                          console.log("typeof option= ", "object", option);
                          return (<span key={index}>
                            <Button variant="contained" className={classes.button} onClick={(e) => this.handleOptionsClick(e, option, item)}>
                            {option.iconurl && <img src={option.iconurl} style={{maxWidth: 22, margin: 0}} />}{option.title}
                            </Button>
                            </span>)
                        }
                      })
                    }
                    {
                      showQuickReplies &&
                      item.quick_replies.map((reply, index) => {
                        if(typeof reply == 'string') {
                          console.log("typeof reply= ", "string", reply);
                          return (<span key={index}>
                            <Button variant="contained" className={classes.button} onClick={(e) => this.handleOptionsClick(e, reply, item)}>
                            {reply}
                            </Button>
                            </span>)
                        } else {
                          console.log("typeof reply= ", "object", reply);
                          return (<span key={index}>
                            <Button variant="contained" className={classes.button} onClick={(e) => this.handleOptionsClick(e, reply, item)}>
                            {reply.image_url && <img src={reply.image_url} style={{maxWidth: 22, margin: 0}} />}{reply.title}
                            </Button>
                            </span>)
                        }
                      })
                    }
                  </div>)
                })
              }
            </div>
            <div className={Styles.actionBtns}>
      				<TextField
      					onChange={this.handleMsg}
      					value={this.state.message}
      					fullWidth={true}
      					hintText="Type a message..."
      					multiLine={true}
      					underlineStyle={{display: 'none'}}
      					onKeyPress={ev => {
      						if (ev.key === "Enter" && ev.shiftKey) {
      							this.sendPlz();
      							ev.preventDefault();
      						}
      					}}
      					ref="autoFocus"
                className={Styles.textField}
      				/>
      				<a onClick={this.sendPlz}>
      					<ActionSend color={cyan500} />
      				</a>
      			</div>
          </div>
          :
          <div className={classes.getStarted}>
          <Button variant="contained" className={classes.button} onClick={this.handleGetStarted}>
            Get Started
          </Button>
          </div>
        }
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in Discover= ", state);
    return {
        me: state.friends.me || {},
        fcmToken: state.login.fcmToken || null,
        login: state.login.login || {},
        onboardingData: state.login.onboardingData || {},
        channelId: state.login.channelId || "",
        botData: state.login.botData || []
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveOnboardingData: (data) => {
          dispatch(saveOnboardingData(data));
        },
        addBotData: (data) => {
          dispatch(addBotData(data));
        },
        sendBotReply: (data) => {
          dispatch(sendBotReply(data));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles, { withTheme: true })(Discover))
