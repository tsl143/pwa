import React, { Component } from 'react';

import FriendList from '../FriendList';
import Chat from '../Chat';

import Styles from './style.scss';

export default class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screen: 'list',
            from: '2c4049be7a41473d8b743a816bed041b',
            friendData: {}
        };
        this.letsChat = this.letsChat.bind(this);
        this.toggleScreen = this.toggleScreen.bind(this);
    }

    toggleScreen(screen) {
        this.setState({
            screen
        })
    }

    letsChat(friendData) {
        this.setState({
            screen: 'chat',
            friendData
        });
    }

    render() {
        return (
            <div>
                {this.state.screen === 'list' &&
                    <div>
                        <FriendList letsChat={this.letsChat}/>
                    </div>
                }
                {this.state.screen === 'chat' &&
                    <div>
                        <Chat toggleScreen={this.toggleScreen} from={this.state.from} data={this.state.friendData} />
                    </div>
                }
            </div>
        );        
    }
}