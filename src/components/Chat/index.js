import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import {
  Card,
  CardHeader,
  CardTitle,
  CardText
} from "material-ui/Card";
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Paper from "material-ui/Paper";
import ActionSend from 'material-ui/svg-icons/content/send';

import Header from '../Header';
//import { getNotifications, getNotificationsCache } from '../../actions/notification';

import Styles from './style.scss';

const myFirebase = new Firebase("https://test-neargroup.firebaseio.com");
let chatTOId = '';
let chatFROMId = "";

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

    componentWillMount() {
        //this.props.getNotificationsCache();
    }

    componentDidMount() {
        chatFROMId = window.prompt('Enter from chatID');
        chatTOId = window.prompt("Enter to chatID");
        this.startListening();
    }

    handleMsg(prop,message) {
        this.setState({
            message
        });
    }

    sendPlz() {
        this.setState({
            message: ''
        });
		myFirebase.push({
            //from: this.props.from,
            from: chatFROMId,
            //to: this.props.data,
            to: {
                channelid: chatTOId,
                name: this.props.data.name
            },
			uId: 1234,
            msg: this.state.message,
            timeStamp: Date.now()
      	});
    }

    startListening() {
        const self = this;
        myFirebase.on('child_added', function(snapshot) {
            const msg = snapshot.val();
            if(
                (
                    msg.from == chatFROMId &&
                    msg.to.channelid == chatTOId
                ) ||
                (
                    msg.from == chatTOId &&
                    msg.to.channelid == chatFROMId
                )
            ){
                self.setState(prevState => {
                    const chats = [...prevState.chats];
                    chats.push(msg);
                    return { chats };
                });
            }
        });
    }

    render() {
        const AvtarUrl = "https://img.neargroup.me/project/forcesize/65x65/pixelate_3/profile_";
        return <div>
            <div className={Styles.ChatBox}>
              {this.state.chats.map((chat, index) => {
                return <div key={index} className={chat.from == chatFROMId ? `${Styles.self} ${Styles.chatlet}` : `${Styles.chatlet}`}>
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
              <TextField onChange={this.handleMsg} value={this.state.message} fullWidth={true} hintText="letsGo" onKeyPress={ev => {
                  if (ev.key === "Enter") {
                    this.sendPlz()
                    ev.preventDefault();
                  }
                }} />
              <a onClick={this.sendPlz}>
                <ActionSend />
              </a>
            </div>
        </div>;
    }
}