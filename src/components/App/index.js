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
        if (firebase && firebase.apps.length === 0) {
            initialize();
        }
        const lastMessages = localStorage.getItem('NG_PWA_LAST_MSG');
        try {
            this.setState({
                lastMsg: JSON.parse(lastMessages)
            })
        }catch(e){}
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
                localStorage.setItem('NG_PWA_AUTHID', JSON.stringify(authId));
            } else {
                try{
                    authId = JSON.parse(localStorage.getItem('NG_PWA_AUTHID'));
                }catch(e){}
                
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
            this.state.firstCall &&
            navigator.onLine
        ) {
            this.setState({ firstCall: false });
            props.friends.forEach(friend => {
                firebase.database().ref(`/rooms/${friend.meetingId}`)
                .limitToLast(1)
                .once('value', snap => {
                    const value = snap.val();
                    if (value) {
                        const msg = value[Object.keys(value)[0]];
                        this.props.getLastMsg(friend.meetingId, msg);
                    }
                    
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
                        <FriendList letsChat={this.letsChat}/>
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
        getLastMsg: (id, msg) => {
            dispatch(getLastMsg(id, msg));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
