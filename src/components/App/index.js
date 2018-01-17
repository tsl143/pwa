import React, { Component } from 'react';
import { connect } from 'react-redux';
import FriendList from '../FriendList';
import Chat from '../Chat';
import { getFriends, getFriendsCache, getLastMsg, sendPush } from '../../actions/friends';
import initialize from "../../initializeFirebase";
import setFCM from '../../FCM';

import Styles from './style.scss';

let lastTouchY = 0;
let maybePreventPullToRefresh = false;

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screen: 'list',
            friendData: {},
            lastMsg: {},
            error: false,
            firstCall: true
        };
        this.letsChat = this.letsChat.bind(this);
        this.toggleScreen = this.toggleScreen.bind(this);
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.stopTouchReload = this.stopTouchReload.bind(this);
        this.processNotifications = this.processNotifications.bind(this);
    }

    componentWillMount() {
        this.props.getFriendsCache();
        document.addEventListener('touchstart', this.touchstartHandler, false);
        document.addEventListener('touchmove', this.stopTouchReload, false);
        this.setState({
            isNotificationEnabeled: localStorage.getItem(`NG_PWA_NOTIFICATION`)
        });
        if (firebase.apps.length === 0) {
            initialize();
        }
    }

    touchstartHandler(e) {
        try{
            if (e.touches.length != 1) return;
            lastTouchY = e.touches[0].clientY;
            maybePreventPullToRefresh = window.pageYOffset == 0;
        }catch(e){}
    }

    stopTouchReload(e) {
        try{
            const touchY = e.touches[0].clientY;
            var touchYDelta = touchY - lastTouchY;
            lastTouchY = touchY;
            if (maybePreventPullToRefresh) {
                maybePreventPullToRefresh = false;
                if (touchYDelta > 0) {
                    e.preventDefault();
                    return;
                }
            }
        }catch(e){}
      }

    componentDidMount() {
        if(navigator.onLine){
            let authId;
            const searchText = this.props.route.location.search;
            if(searchText && searchText.trim != ""){
                const searchParams = searchText.split('=');
                if(searchParams.length > 2) this.setState({ error: true });
                authId = searchParams.pop();
                localStorage.setItem('NG_PWA_AUTHID', authId);
            } else {
                authId = localStorage.getItem('NG_PWA_AUTHID')
            }
            
            this.props.getFriends(authId);
        }
    }

    toggleScreen(screen) {
        this.setState({
            screen,
            friendData: {}
        })
    }

    letsChat(friendData) {
        this.setState({
            screen: 'chat',
            friendData
        });
    }

    componentWillReceiveProps(props) {
        if(
            props &&
            props.friends &&
            props.friends.length != 0 &&
            this.state.firstCall
        ) {
            //write code for last message at list
            props.friends.forEach(friend => {
                //this.props.getLastMsg(friend.meetingId);
                firebase.database().ref(`/rooms/${friend.meetingId}`)
                .limitToLast(1)
                .once('value', snap => {
                    const value = snap.val();
                    const msg = value[Object.keys(value)[0]];
                    this.setState(prev => {
                        const lastMsg = { ...prev.lastMsg };
                        lastMsg[friend.meetingId] = msg.msg.substr(0,100);
                        return { lastMsg };
                    })
                });
            })
        }
    }

    processNotifications() {
        this.setState({
            isNotificationEnabeled: true
        });
        localStorage.setItem(`NG_PWA_NOTIFICATION`, true);
        if(
            this.props.me &&
            this.props.me.channelId
        ) {
            setFCM(this.props.me.channelId);
        }
    }

    render() {
        const { me } = this.props;

        if(this.state.error || !me.channelId) return <div />;
        return (
            <div>
                {!this.state.isNotificationEnabeled &&
                    <div>
                        <div className={Styles.overlay} />
                        <div
                            className={Styles.popup}
                            style={{background: 'url(notify.png)'}}
                            onClick={this.processNotifications}
                        />
                    </div>
                }
                {this.state.screen === 'list' &&
                    <div>
                        <FriendList letsChat={this.letsChat} lastMsg={this.state.lastMsg}/>
                    </div>
                }
                {this.state.screen === 'chat' &&
                    <div>
                        <Chat sendPush={this.props.sendPush} toggleScreen={this.toggleScreen} fromId={me.channelId} data={this.state.friendData} />
                    </div>
                }
            </div>
        );        
    }
}

const mapStateToProps = state => {
    return {
        me: state.friends.me || {},
        friends: state.friends.friends || [],
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFriends: authId =>{
            dispatch(getFriends(authId));
        },
        getFriendsCache: () =>{
            dispatch(getFriendsCache());
        },
        sendPush: data => {
            dispatch(sendPush(data));
        },
        getLastMsg: id => {
            dispatch(getLastMsg(id));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);