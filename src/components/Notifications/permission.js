import React, { Component } from 'react';
import { connect } from 'react-redux';
import FriendList from '../FriendList';
import Chat from '../Chat';
import { getFriends, getFriendsCache, getLastMsg, getFriendsChat } from '../../actions/friends';
import initialize from "../../initializeFirebase";
import setFCMonly from '../../onlyFCM';

import Styles from './style.scss';

let lastTouchY = 0;
let maybePreventPullToRefresh = false;

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            firstCall: true,
            isNotificationEnabeled: false
        };
        this.touchstartHandler = this.touchstartHandler.bind(this);
        this.stopTouchReload = this.stopTouchReload.bind(this);
        // this.processNotifications = this.processNotifications.bind(this);
    }

    componentWillMount() {
        this.props.getFriendsCache();
        document.addEventListener('touchstart', this.touchstartHandler, false);
        document.addEventListener('touchmove', this.stopTouchReload, false);
        // this.setState({
        //     isNotificationEnabeled: localStorage.getItem(`NG_PWA_NOTIFICATION`)
        // });
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
      if(document.getElementById('loading')) document.getElementById('loading').remove();
      let authId;
          const searchText = this.props.route.location.search;
          if(searchText && searchText.trim != ""){
              const searchParams = searchText.split('=');
              if(searchParams.length > 2) this.setState({ error: true });
              authId = searchParams.pop();
              // localStorage.setItem('NG_PWA_AUTHID', JSON.stringify(authId));
          }
          console.log('channelId in setFcm= ', authId);
      setFCMonly(authId);
        // if(navigator.onLine && !this.props.noReload){
        //     let authId;
        //     const searchText = this.props.route.location.search;
        //     if(searchText && searchText.trim != ""){
        //         const searchParams = searchText.split('=');
        //         if(searchParams.length > 2) this.setState({ error: true });
        //         authId = searchParams.pop();
        //         localStorage.setItem('NG_PWA_AUTHID', JSON.stringify(authId));
        //     } else {
        //         try{
        //             authId = JSON.parse(localStorage.getItem('NG_PWA_AUTHID'));
        //         }catch(e){}
        //     }
        //     this.props.getFriends(authId);
        // }
    }

    render() {
      console.log("notification in app index= ", this.state);
        const { me } = this.props;

        if(this.state.error || !me.channelId) return <div />;
        return (
            <div></div>
        );
    }
}

const mapStateToProps = state => {
    return {
        me: state.friends.me || {},
        friends: state.friends.friends || [],
        noReload: state.friends.noReload || false
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFriends: authId => {
            dispatch(getFriends(authId));
        },
        getFriendsCache: () => {
            dispatch(getFriendsCache());
        },
        getFriendsChat: (channelId, newFriends) => {
            dispatch(getFriendsChat(channelId, newFriends));
        },
        getLastMsg: (id, msg) => {
            dispatch(getLastMsg(id, msg));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
