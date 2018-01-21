import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Twemoji } from "react-emoji-render";
import Avatar from "material-ui/Avatar";
import TextField from "material-ui/TextField";
import ActionSend from "material-ui/svg-icons/content/send";
import RefreshIndicator from "material-ui/RefreshIndicator";
import { cyan500 } from "material-ui/styles/colors";
import { getLastMsg, sendPush } from '../../actions/friends';
import initialize from "../../initializeFirebase";
import { htmlDecode, formatTime, formatDate } from '../../utility';

import Header from "../Header";

import Styles from "./style.scss";

let myFirebase;
let writeFirebase = {};
let lastChat = {};
let isOnline;
let lastSeen;

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			chats: [],
			loading: true,
			isOtherOnline: false,
			sentTime: Date.now()
		};
		this.handleMsg = this.handleMsg.bind(this);
		this.sendPlz = this.sendPlz.bind(this);
		this.startListening = this.startListening.bind(this);
	}

	componentWillMount() {
		if(!this.props.data) return false;
		const { data, fromId, botChats } = this.props;
		let myBotChat = [];
		let chatsRetrieved = [];
		if(botChats[data.meetingId] && botChats[data.meetingId].length !==0){
			myBotChat = botChats[data.meetingId];
		}
		const cachedChats = localStorage.getItem(`NG_PWA_CHAT_${data.meetingId}`);
		if (cachedChats && cachedChats.length > 0) {
			chatsRetrieved = JSON.parse(cachedChats);
			lastChat = chatsRetrieved[chatsRetrieved.length - 1];
		}
		this.setState({
			chats: myBotChat.concat(chatsRetrieved)
		});
		window.onresize = () => {
			this.scrollUp();
		}
	}

	componentDidMount() {
		if(!this.props.data) return false;
		const { data, fromId } = this.props;
		if (lastChat.id) {
			myFirebase = firebase
				.database()
				.ref(`/rooms/${data.meetingId}`)
				.orderByKey()
				.startAt(lastChat.id);
		} else {
			myFirebase = firebase.database().ref(`/rooms/${data.meetingId}`);
		}

		writeFirebase = {
			chat: firebase.database().ref(`/rooms/${data.meetingId}`),
			isOnline: firebase.database().ref(`/isOnline/${fromId}`),
			isOtherOnline: firebase.database().ref(`/isOnline/${data.channelId}`),
			lastSeen: firebase.database().ref(`/lastSeen/${data.channelId}`),
		};
		writeFirebase.isOnline.set({ online: true });
		this.startListening();
		this.scrollUp();
	}

	componentDidUpdate() {
		this.scrollUp();
	}

	componentWillUnmount() {
		window.onresize = {};
	}

	scrollUp() {
		try{
			const chatbox = document.getElementById('chatBox');
			chatbox.scrollTo(0, chatbox.scrollHeight);
		}catch(e){}
	}

	handleMsg(prop, message) {
		this.setState({
			message
		});
	}

	sendPlz() {
		const { data, fromId } = this.props;
		if (this.state.message.trim() === "") return false;
		this.setState({
			message: ""
		});
		const chatObj = {
			fromId,
			toId: data.channelId,
			msg: this.state.message,
			sentTime: Date.now(),
			arrivedAt: Firebase.ServerValue.TIMESTAMP
		};
		this.setChat(chatObj);
		writeFirebase.chat.push(chatObj).then(res => {
			chatObj.id = res.key;
			if (chatObj.id) {
				this.storeChat(chatObj);
			}
			this.props.getLastMsg(this.props.data.meetingId, chatObj)
		});
		try {
			this.refs["autoFocus"].select();
		} catch (e) {}

		if (!this.state.isOtherOnline && navigator.onLine) {
			this.props.sendPush({
				toChannelId: data.channelId,
				fromChannelId: fromId,
				msg: this.state.message.substring(0,200)
			});
		}
	}

	startListening() {
		//intercepts for any new message from firebase with check of lastchatId
		myFirebase.on("child_added", snapshot => {
			const msg = snapshot.val();
			const msgId = snapshot.key;
			msg.id = msgId;
			if (
				(lastChat.id && lastChat.id === msgId) ||
				(msg.fromId === this.props.fromId &&
				parseInt(msg.sentTime, 10) > this.state.sentTime)
			) {
				return true;
			} else {
				this.setChat(msg);
				this.storeChat(msg);
			}
		});
		myFirebase.on("value", snapshot => {
			this.setState({ loading: false });
		});

		//manage self online and last seen
		writeFirebase.isOnline.onDisconnect().set({ online: false });
		writeFirebase.lastSeen.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);

		//check if other participant is online
		writeFirebase.isOtherOnline.on("child_changed", snapshot => {
			const isOtherOnline = snapshot.val();
			this.setState({ isOtherOnline });
		});
	}

	setChat(msg) {
		this.setState((prevState, props) => {
			const chats = [...prevState.chats];
			chats.push(msg);
			return { chats, loading: false };
		});
	}

	storeChat(msg) {
		try {
			const { data } = this.props;
			const chats = JSON.parse(localStorage.getItem(`NG_PWA_CHAT_${data.meetingId}`)) || [];
			chats.push(msg);
			localStorage.setItem(
				`NG_PWA_CHAT_${this.props.data.meetingId}`,
				JSON.stringify(chats)
			);
		}catch(e){}
	}

	render() {
		const { data, fromId } = this.props;
		if(!data){
			return <Redirect to="/" push />
		}
		const AvtarUrl = `https://img.neargroup.me/project/50x50/forcesize/50x50/profile_${data.imageUrl}`;
		return (
		<div className={Styles.chatWindow}>
			<Header
				name={data.name}
				avtar={AvtarUrl}
				action='home'
			/>
			{
				this.state.loading &&
				navigator.onLine &&
				<RefreshIndicator
					size={40}
					left={10}
					top={0}
					status="loading"
					className={Styles.refresh}
				/>
			}
			<div className={Styles.ChatBox} id="chatBox">
				{this.state.chats.map((chat, index) => {
					let newDay = "";
					if (index === 0) {
						newDay = formatDate(chat.sentTime);
					} else {
						const newDate = formatDate(chat.sentTime);
						const oldDate = formatDate(
							this.state.chats[index - 1].sentTime
						);
						if (newDate !== oldDate) {
							newDay = newDate;
						}
					}
					return(
					<div key={index} className={chat.fromId == fromId ? Styles.self : ""}>
						{newDay && 
							<div className={Styles.newDay}>
								{newDay}
							</div>
						}
						<span className={Styles.chatlet}>
							<Twemoji text={htmlDecode(chat.msg)} />
						</span>
						<span className={Styles.time}>
							{formatTime(chat.sentTime)}
						</span>
					</div>);
				})}
			</div>
			<div className={Styles.actionBtns}>
				<TextField
					onChange={this.handleMsg}
					value={this.state.message}
					fullWidth={true}
					hintText="Message"
					multiLine={true}
					underlineStyle={{display: 'none'}}
					onKeyPress={ev => {
						if (ev.key === "Enter" && ev.shiftKey) {
							this.sendPlz();
							ev.preventDefault();
						}
					}}
					ref="autoFocus"
				/>
				<a onClick={this.sendPlz}>
					<ActionSend color={cyan500} />
				</a>
			</div>
		</div>
		);
	}
}

const mapStateToProps = state => {
	return {
		fromId: (state.friends.me && state.friends.me.channelId) || '',
		data: state.friends.meetingData || null,
		botChats: state.friends.botChats || {}
	  }
}

const mapDispatchToProps = dispatch => {
	return {
		getLastMsg: (id, msg) => {
			dispatch(getLastMsg(id, msg));
		},
		sendPush: data => {
            dispatch(sendPush(data));
        }
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
