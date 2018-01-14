import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import ActionSend from 'material-ui/svg-icons/content/send';
import ActionList from 'material-ui/svg-icons/action/view-list';
import {cyan500} from 'material-ui/styles/colors';

import Header from '../Header';

import Styles from './style.scss';

let myFirebase;
let writeFirebase = {};
let lastChat= {};
let isOnline;
let lastSeen;

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            chats: [],
            lastChat: {},
            isOtherOnline: false
        }
        this.handleMsg = this.handleMsg.bind(this);
        this.sendPlz = this.sendPlz.bind(this);
        this.startListening = this.startListening.bind(this);
    }

    componentDidMount() {
        const { data, fromId } = this.props;
        const cachedChats = localStorage.getItem(`NG_PWA_CHAT_${data.meetingId}`);
        if(cachedChats && cachedChats.length > 0){
            const chatsRetrieved = JSON.parse(cachedChats);
            lastChat = chatsRetrieved[chatsRetrieved.length - 1];
            this.setState({
                chats: chatsRetrieved
            });
            myFirebase = firebase.database().ref(`/rooms/${data.meetingId}`).orderByKey().startAt(lastChat.id)
        } else {
            myFirebase = firebase.database().ref(`/rooms/${data.meetingId}`)
        }

        const connectFirebase = new Firebase(`https://test-neargroup.firebaseio.com/`);
        writeFirebase = {
            chat: connectFirebase.child('rooms').child(data.meetingId),
            isOnline: connectFirebase.child('isOnline').child(fromId),
            isOtherOnline: firebase.database().ref(`/isOnline/${data.channelId}`),
            lastSeen: connectFirebase.child('lastSeen').child(data.meetingId),
        }
        writeFirebase.isOnline.set({ online: true });
        this.startListening();
    }

    componentDidUpdate() {
        window.scrollTo(0, document.body.scrollHeight);
    }

    handleMsg(prop,message) {
        this.setState({
            message
        });
    }

    sendPlz() {
        const { data, fromId } = this.props;
        if(this.state.message.trim() === '')
            return false;
        this.setState({
            message: ''
        });
		writeFirebase.chat.push({
            fromId,
            toId: data.channelId,
            msg: this.state.message,
            arrivedAt: Firebase.ServerValue.TIMESTAMP,
      	});
        try{
            this.refs["autoFocus"].select();
        }catch(e){}

        if(!this.state.isOtherOnline) {
            this.props.sendPush(
                {
                    "toChannelId": data.channelId,
                    "fromChannelId": fromId,
                    "msg": this.state.message,
                }
            )
        }
    }

    startListening() {
        myFirebase.on('child_added', snapshot => {
            const msg = snapshot.val();
            const msgId = snapshot.key;
            msg.id = msgId;
            if(
                lastChat.id &&
                lastChat.id === msgId
            ){
                return true;
            } else {
                this.setState((prevState, props) => {
                    const chats = [...prevState.chats];
                    chats.push(msg);
                    localStorage.setItem(`NG_PWA_CHAT_${props.data.meetingId}`, JSON.stringify(chats));
                    return { chats };
                });
            }
        });
        const connectFirebase = new Firebase(`https://test-neargroup.firebaseio.com/`);
        writeFirebase.isOnline.onDisconnect().set({ online: false });
        writeFirebase.lastSeen.onDisconnect().set(Firebase.ServerValue.TIMESTAMP);

        writeFirebase.isOtherOnline.on('child_changed', snapshot => {
            const isOtherOnline = snapshot.val();
            this.setState({ isOtherOnline })
        });

        writeFirebase.isOtherOnline.on('child_added', snapshot => {
            const isOtherOnline = snapshot.val();
            this.setState({ isOtherOnline })
        });
    }

    render() {
        const { data, fromId } = this.props;
        const AvtarUrl = `https://img.neargroup.me/project/forcesize/50x50/profile_${data.imageUrl}`;
        return (
            <div>
                <Header
                    name={data.name}
                    avtar={AvtarUrl}
                    action={this.props.toggleScreen}
                />
                <div className={Styles.ChatBox}>
                  {this.state.chats.map((chat, index) => {
                    return (
                        <div key={index} className={chat.fromId == fromId ? Styles.self : ''}>
                            <span className={Styles.chatlet}>
                                {chat.msg}
                            </span>
                        </div>
                    );
                  })}
                </div>
                <div className={Styles.actionBtns}>
                    <TextField
                        onChange={this.handleMsg}
                        value={this.state.message}
                        fullWidth={true}
                        hintText="Message"
                        onKeyPress={ev => {
                            if (ev.key === "Enter") {
                                this.sendPlz();
                                ev.preventDefault();
                            }
                        }}
                        ref="autoFocus"
                    />
                    <a onClick={this.sendPlz}>
                        <ActionSend color={cyan500}/>
                    </a>
                </div>
            </div>
        );
    }
}
