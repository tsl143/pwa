import React, { Component } from 'react';

import Avatar from 'material-ui/Avatar';
import TextField from 'material-ui/TextField';
import ActionSend from 'material-ui/svg-icons/content/send';
import ActionList from 'material-ui/svg-icons/action/view-list';
import {cyan500} from 'material-ui/styles/colors';

import Header from '../Header';

import Styles from './style.scss';

let myFirebase;

export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
            message: '',
            chats: []
        }
        this.handleMsg = this.handleMsg.bind(this);
        this.sendPlz = this.sendPlz.bind(this);
        this.startListening = this.startListening.bind(this);
    }

    componentDidMount() {
        const channelId = window.prompt('Enter channelId');
        myFirebase = new Firebase(`https://test-neargroup.firebaseio.com/rooms/${channelId}`);
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
        if(this.state.message.trim() === '')
            return false;
        this.setState({
            message: ''
        });
		myFirebase.push({
            from: this.props.from,
            to: this.props.data,
			uId: 1234,
            msg: this.state.message,
            timeStamp: Date.now()
      	});
        try{
            this.refs["autoFocus"].select();
        }catch(e){}
    }

    startListening() {
        const self = this;
        myFirebase.on('child_added', function(snapshot) {
            const msg = snapshot.val();
            self.setState(prevState => {
                const chats = [...prevState.chats];
                chats.push(msg);
                return { chats };
            });
        });
    }

    render() {
        const AvtarUrl = "https://img.neargroup.me/project/forcesize/65x65/pixelate_3/profile_";
        return (
            <div>
                <Header name="Chat"/>
                <div className={Styles.ChatBox}>
                  {this.state.chats.map((chat, index) => {
                    return <div key={index} className={chat.from == this.props.from ? `${Styles.self} ${Styles.chatlet}` : `${Styles.chatlet}`}>
                        <div className={Styles.avatarHolder}>
                          <Avatar src={`${AvtarUrl}${chat.to.channelid}`} size={30} />
                        </div>
                        <div className={Styles.chatletHolder}>
                          <b>{chat.to.name}</b>
                          <br />
                          {chat.msg}
                        </div>
                      </div>;
                  })}
                </div>
                <div className={Styles.actionBtns}>
                    <a onClick={() => this.props.toggleScreen('list')}>
                        <ActionList color={cyan500}/>
                    </a>
                    <TextField
                        onChange={this.handleMsg}
                        value={this.state.message}
                        fullWidth={true}
                        hintText="letsGo"
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
