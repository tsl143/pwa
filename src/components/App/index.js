import React, { Component } from 'react';
import { connect } from 'react-redux';
import FriendList from '../FriendList';
import Chat from '../Chat';
import { getFriends, getFriendsCache, sendPush } from '../../actions/friends';
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
            error: false
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
            const searchText = this.props.route.location.search;
            const searchParams = searchText.split('=');
            
            if(searchParams.length > 2) this.setState({ error: true });

            const authId = searchParams.pop();
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
        me: state.friends.me || {}
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
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);