import React, { Component } from "react";
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

import { Twemoji } from "react-emoji-render";
import Timestamp from "react-timestamp";
import Avatar from "material-ui/Avatar";
import TextField from "material-ui/TextField";
import ActionSend from "material-ui/svg-icons/content/send";
import ActionSeen from "material-ui/svg-icons/action/done-all";
import ActionUnSeen from "material-ui/svg-icons/navigation/check";
import RefreshIndicator from "material-ui/RefreshIndicator";
import { cyan500 } from "material-ui/styles/colors";
import { getLastMsg, sendPush, addChildListener, setChats, addChats, setItems } from '../../actions/friends';
import initialize from "../../initializeFirebase";
import { htmlDecode, formatTime, formatDate } from '../../utility';

import Header from "../Header";

import Styles from "./style.scss";

class Chat extends Component {
	constructor(props) {
		super(props);
		this.state = {
			message: "",
			chats: [],
			loading: true,
			isOtherOnline: false,
			friendsLastSeen: '',
			sentTime: Date.now()
		};
		this.handleMsg = this.handleMsg.bind(this);
		this.sendPlz = this.sendPlz.bind(this);
		this.startListening = this.startListening.bind(this);
		this.handleChildAdd = this.handleChildAdd.bind(this);
		this.headerValue = this.headerValue.bind(this);
	}

	componentWillMount() {
		if(!this.props.data) return false;
		const { data, fromId } = this.props;
		this.props.setChats(data.meetingId);

		window.onresize = () => {
			this.scrollUp();
		}

		//check if other participant is online
		firebase.database()
		.ref(`/isOnline/${data.channelId}`)
		.once("value", snapshot => {
			const isOnline = snapshot.val();
			if( isOnline && isOnline.online) this.props.setItems('isOtherOnline', data.channelId, isOnline.online);
		});

		// get lastSeen of friend
		firebase.database()
		.ref(`/lastSeen/${data.channelId}`)
		.once("value", snapshot => {
			const lastSeen = snapshot.val();
			if( lastSeen && lastSeen.seenTime ) this.props.setItems('friendsLastSeen', data.channelId, lastSeen.seenTime);
		});

		// if user is offline, get last seen of friend from cache
		if(!navigator.onLine) {
			try{
				const lastSeens = JSON.parse(localStorage.getItem('NG_PWA_FRIEND_LAST_SEEN'));
				if(lastSeens[data.channelId]) this.props.setItems('friendsLastSeen', data.channelId, lastSeens[data.channelId]);
			} catch(e){}
		}
	}

	componentWillReceiveProps(nextProps){
		const { data, chats, childListeners, fromId } = nextProps;
		const myChats = chats[data.meetingId];
		this.setState({ chats: myChats });
		if (!childListeners.includes(data.meetingId)) {
			let lastChat;
			if (myChats && myChats.length > 0) {
				lastChat = myChats[myChats.length - 1];
			}
            this.startListening(lastChat);
        } else {
            this.setState({ loading: false });
		}
	}

	componentDidMount() {
		if(document.getElementById('loading')) document.getElementById('loading').remove();
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
			chatbox.scrollTop = chatbox.scrollHeight;
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
			msg: this.state.message,
			sentTime: Date.now()
		};
		this.setChat(chatObj);
		firebase
			.database()
			.ref(`/rooms/${data.meetingId}`)
			.push(chatObj).then(res => {
				chatObj.id = res.key;
				if (chatObj.id) {
					this.storeChat(chatObj);
				}
				this.props.getLastMsg(data.meetingId, chatObj)
			});
		try {
			this.refs["autoFocus"].select();
		} catch (e) {}

		if (navigator.onLine) {
			this.props.sendPush({
				toChannelId: data.channelId,
				fromChannelId: fromId,
				msg: this.state.message.substring(0,200)
			});
		}
	}

	startListening(lastChat) {
		const {data, fromId} = this.props;

		//intercepts for any new message from firebase with check of lastchatId
		if (lastChat && lastChat.id) {
			firebase
				.database()
				.ref(`/rooms/${data.meetingId}`)
				.orderByKey()
				.startAt(lastChat.id)
				.on('child_added', snapshot => this.handleChildAdd(snapshot, lastChat));

		} else {
			firebase
				.database()
				.ref(`/rooms/${data.meetingId}`)
				.on('child_added', snapshot => this.handleChildAdd(snapshot));
		}

		firebase.database()
		.ref(`/isOnline/${data.channelId}`)
		.on("child_changed", snapshot => {
			const isOtherOnline = snapshot.val();
			if(isOtherOnline!==null && typeof isOtherOnline !== 'undefined') this.props.setItems('isOtherOnline', data.channelId, isOtherOnline);
		});

		firebase.database()
		.ref(`/lastSeen/${data.channelId}`)
		.on("child_changed", snapshot => {
			const friendsLastSeen = snapshot.val();
			if(friendsLastSeen) this.props.setItems('friendsLastSeen', data.channelId, friendsLastSeen);
		});

		this.props.addChildListener(data.meetingId);
	}

	handleChildAdd(snapshot, lastChat) {
		const msg = snapshot.val();
		const msgId = snapshot.key;
		msg.id = msgId;
		if (
			(lastChat && lastChat.id && lastChat.id === msgId) ||
			(msg.fromId === this.props.fromId &&
			parseInt(msg.sentTime, 10) > this.state.sentTime)
		) {
			return true;
		} else {
			this.setChat(msg);
			this.storeChat(msg);
		}
	}

	setChat(msg) {
		this.props.addChats(this.props.data.meetingId, msg)
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

	headerValue(name) {
		const { data, isOtherOnline, friendsLastSeen } = this.props;
		let subHead = '';
		if(navigator.onLine) {
			if (isOtherOnline && isOtherOnline[data.channelId])
			subHead = <span>Online</span>;
			else if(friendsLastSeen && friendsLastSeen[data.channelId]){
				const lastSeenObj = new Date(friendsLastSeen[data.channelId]);
				subHead = <span>Last seen {<Timestamp time={lastSeenObj} />}</span>;
			}
			else subHead = 'Not yet on NG lite';
		}
		return <div className={Styles.chatHeader}>
			<span>{name}</span>
			<span>{subHead}</span>
		</div>
	}

	render() {
		const { data, fromId, isOtherOnline, friendsLastSeen } = this.props;
		if(!data){
			return <Redirect to="/" push />
		}
		const AvtarUrl = `https://img.neargroup.me/project/50x50/forcesize/50x50/profile_${data.imageUrl}`;
		return (
		<div className={Styles.chatWindow}>
			<Header
				name={this.headerValue(data.name)}
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
					const chatTime = chat.sentTime?new Date(parseInt(chat.sentTime,10)):null;
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
							{
								chatTime &&
								<Timestamp time={chatTime} format='time'/>
							}
							{
								chat.fromId == fromId &&
								<span className={Styles.isSeen}>
									{
										(isOtherOnline && isOtherOnline[data.channelId]) ||
										(friendsLastSeen && (chat.sentTime <= friendsLastSeen[data.channelId]))
										? <ActionSeen color={cyan500}/>
										: <ActionUnSeen/>
									}
								</span>
							}
						</span>
					</div>);
				})}
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
		childListeners: state.friends.childListeners || [],
		chats: state.friends.chats || {},
		triggerStamp: state.friends.triggerStamp || Date.now(),
		isOtherOnline: state.friends.isOtherOnline || {},
		friendsLastSeen: state.friends.friendsLastSeen || {},
	  }
}

const mapDispatchToProps = dispatch => {
	return {
		getLastMsg: (id, msg) => {
			dispatch(getLastMsg(id, msg));
		},
		sendPush: data => {
            dispatch(sendPush(data));
		},
		addChildListener: meetingId => {
			dispatch(addChildListener(meetingId));
		},
		setChats: meetingId => {
			dispatch(setChats(meetingId));
		},
		addChats: (meetingId, msg) => {
			dispatch(addChats(meetingId, msg));
		},
		setItems: (item, id, value) => {
			dispatch(setItems(item, id, value));
		}
	}
}

export default connect(mapStateToProps, mapDispatchToProps)(Chat);
