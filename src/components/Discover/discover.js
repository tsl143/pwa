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
// import TextField from '@material-ui/core/TextField';
import TextField from "material-ui/TextField";
import InputAdornment from '@material-ui/core/InputAdornment';
import { cyan500 } from "material-ui/styles/colors";
// import Geosuggest from 'react-geosuggest';
// import { parseNumber, formatNumber, AsYouType } from 'libphonenumber-js'
import Fontawesome from 'react-fontawesome'
import botApiPayloads, {get_started} from '../../shared/botApiPayloads'
// import {saveLoginSession, addBotData } from '../../actions/login';
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
  }

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps  Discover = ', nextProps);
    if(nextProps.botData != this.props.botData) {
      this.setState({botData: nextProps.botData})
    }
    // this.setState({onboardingData: nextProps.onboardingData})
    if(nextProps.channelId && nextProps.channelId != "") {
      this.startListening(nextProps.channelId)
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
				.ref(`/bot_rooms/${channelId}`)
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
		console.log('handleChildAdd = ', snapshot, lastChat, this.props.channelId);
		// const msg = snapshot.val();
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
    this.props.addBotData({type: 'user_input', payload_type: 'get_started', text:"get started"})
    this.checkInputType(botApiPayloads.survey)
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

  checkInputType(data) {
    console.log('in checkInputType');
    let payload
    if("recipient" in data) {
      console.log('firebase input contains reciepient');
    } else {
      console.log('firebase input NOT contains reciepient');
      switch (data.type) {
        case "survey":
          console.log("input type SURVEY");
          // payload = botApiPayloads.survey
          this.props.addBotData({...data, type: 'bot_input', payload_type: 'survey', text: data.question, options: data.options})

          break;
        default:

      }
    }
  }

  sendPlz(e) {
    let {message} = this.state
    console.log('send action -- ', e, message);
    if(message == "") return false
    this.props.sendBotReply({type: 'user_input', payload_type: 'normal_text', text: message})
    this.setState({message: ''})
  }

  handleOptionsClick(data) {
    let {type} = data
    console.log('handleOptionsClick- ', data);
    if(type == 'url' || type == 'web_url') {
      console.log('option -- ', type);
      window.location = data.url
    }
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
                  console.log('botDataOptions= ', botDataOptions);

                  return (<div key={index} className={item.type == "user_input" ? Styles.self : ""}>
                    <span className={Styles.chatlet}><Twemoji text={htmlDecode(item.text)} /></span>
                    {
                      botDataOptions &&
                      item.options.map((option, index) => (<div key={index}>
                      <span><Button variant="contained" className={classes.button} onClick={() => this.handleOptionsClick(option)}>
                        {option.title}
                      </Button></span>
                      </div>) )
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
