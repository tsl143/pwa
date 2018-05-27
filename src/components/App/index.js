import React, { Component } from 'react';
import { connect } from 'react-redux';
import FriendList from '../FriendList';
import Chat from '../Chat';
import {setUnreadChatCount, getFriends, getFriendsCache, getLastMsg, getFriendsChat } from '../../actions/friends';
import setFCM from '../../FCM';

import Styles from './style.scss';

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            firstCall: true
        };
        this.processNotifications = this.processNotifications.bind(this);
    }

    componentWillMount() {
        this.props.getFriendsCache();
        if(localStorage.getItem("CHAT_BOX_CLOSED") == null || localStorage.getItem("CHAT_BOX_CLOSED") == undefined) {
          localStorage.setItem("CHAT_BOX_CLOSED", false)
        }
        if(localStorage.getItem("NG_PWA_LAST_MSG") == null || localStorage.getItem("NG_PWA_LAST_MSG") == undefined) {
          localStorage.setItem("NG_PWA_LAST_MSG", JSON.stringify({}))
        }
        this.setState({
            isNotificationEnabeled: localStorage.getItem(`NG_PWA_NOTIFICATION`)
        });
        const lastMessages = localStorage.getItem('NG_PWA_LAST_MSG');
        try {
            this.setState({
                lastMsg: JSON.parse(lastMessages)
            })
        }catch(e){}
    }

    componentDidMount() {
        if(navigator.onLine && !this.props.noReload){
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

    componentWillReceiveProps(props) {
      console.log("App receive props= ", props);
        if(
            navigator.onLine &&
            props.friends &&
            props.friends.length != 0 &&
            this.state.firstCall &&
            !this.props.noReload
        ) {
            // let initialCall = true
            const friendMeetingIds = [];
            console.log("firstCall= ", !this.state.firstCall);
            this.setState({ firstCall: false });
            props.friends.forEach(friend => {
                friendMeetingIds.push(friend.meetingId);
                firebase.database().ref(`/rooms/${friend.meetingId}`)
                .limitToLast(1)
                .on('value', snap => {

                    const value = snap.val();
                    console.log("value on value= ", value);
                    if (value) {
                        const msg = value[Object.keys(value)[0]];
                        console.log("localStorage on initial lastMsg= ", localStorage, msg, friend.meetingId);
                        var showUnreadCount = localStorage.getItem("CHAT_BOX_CLOSED")
                        var lastChat = JSON.parse(localStorage.getItem("NG_PWA_LAST_MSG"))[friend.meetingId]
                        console.log("localstorage lastChat in lastChat= ", lastChat);
                        console.log('getLastMsg in App receive props= ', friend.meetingId, msg);
                        console.log('CHAT_BOX_CLOSED in App receive props= ', showUnreadCount);
                        // console.log('2nd condition= ', lastChat.sentTime != msg.sentTime);
                        // console.log('2nd condition= ', lastChat == undefined || lastChat == null );
                        // if(lastChat == undefined || lastChat == null || lastChat.sentTime == msg.sentTime) {
                        //   console.log("initialCall--");
                        //   this.props.getLastMsg(friend.meetingId, msg);
                        //   // initialCall = false
                        // } else {
                        let lastChatNull = (lastChat == undefined || lastChat == null)
                        let lastChatNew, lastChatNotMe
                        if(lastChatNull) {
                          console.log("lastChatNull NO SHOW");
                          lastChatNew = false
                          lastChatNotMe = false
                        } else {
                          console.log("lastChatNull SHOW");
                          lastChatNew = (lastChat.sentTime != msg.sentTime)
                          lastChatNotMe = msg.fromId != props.me.channelId
                        }
                        let ll = lastChatNull || lastChatNew
                        console.log("lastChatNull= ", ll);
                        console.log("lastChatNotMe: ", showUnreadCount == "true", ll, lastChatNotMe);
                        console.log("result= ", showUnreadCount == "true" && ll && lastChatNotMe);
                          if(showUnreadCount == "true" && ( lastChatNull || lastChatNew ) && lastChatNotMe) {
                            console.log('NOT initialCall');
                            let unreadCountsState = JSON.parse(localStorage.getItem("NG_PWA_UNREAD_COUNTS"))  //props.unreadChatCounts
                            console.log('getLastMsg 222 in App receive props= ', friend.meetingId, msg);
                            let unreadMsgsCount = unreadCountsState[friend.meetingId]
                            console.log('unreadMsgsCount= ',friend.meetingId, " : ", unreadMsgsCount, unreadCountsState);
                            console.log("msg--", msg);
                            if(unreadMsgsCount == undefined || unreadMsgsCount == null){
                              this.props.setUnreadChatCount(friend.meetingId, 0, msg);
                            } else {
                              this.props.setUnreadChatCount(friend.meetingId, Number(unreadMsgsCount) + 1, msg);
                            }

                            // if(unreadMsgsCount == null || unreadMsgsCount == undefined) {
                            //   unreadMsgsCount = localStorage.getItem("NG_PWA_UNREAD_COUNTS")
                            //   console.log("unreadMsgsCount null");
                            //   // unreadMsgsCount[friend.meetingId] = 1
                            //   // localStorage.setItem(NG_PWA_UNREAD_COUNTS, unreadMsgsCount)
                            // } else {
                            //   console.log("unreadMsgsCount NOT null= ", unreadMsgsCount);
                            //   unreadMsgsCount = Number(unreadMsgsCount) + 1
                            //   localStorage.setItem(`NG_PWA_UNREAD_COUNT_${friend.meetingId}`, unreadMsgsCount)
                            // }
                          } else {
                            console.log("initialCall--");
                            this.props.getLastMsg(friend.meetingId, msg);
                          }
                        // }


                    }


                });
            });
            this.setFriendsChat(props.me.channelId, friendMeetingIds);
            if(props.me && props.me.channelId && navigator.onLine) {
                firebase.database().ref(`/isOnline/${props.me.channelId}`).set({ online: true });
                firebase.database().ref(`/isOnline/${props.me.channelId}`).onDisconnect().set({ online: false });
                try {
                    firebase.database().ref(`/lastSeen/${props.me.channelId}`).onDisconnect().set({ seenTime: Firebase.ServerValue.TIMESTAMP });
                }catch(e){}
            }
        }
    }

    setFriendsChat(channelId, friendMeetingIds) {
        try{
            const botChats = JSON.parse(localStorage.getItem('NG_PWA_BOT_CHATS')) || {};
            const storedFriends = Object.keys(botChats);
            const newFriends = friendMeetingIds.filter(id => !storedFriends.includes(id));
            if(newFriends.length !== 0) this.props.getFriendsChat(channelId, newFriends);
        }catch(e){}
    }

    processNotifications() {
        if (!navigator.onLine) return false;
        this.setState({
            isNotificationEnabeled: true
        });
        localStorage.setItem(`NG_PWA_NOTIFICATION`, true);
        localStorage.setItem(`NG_PWA_START`, Date.now());
        if(
            this.props.me &&
            this.props.me.channelId
        ) {
            setFCM(this.props.me.channelId);
        }
    }

    render() {
        const { me } = this.props;
        console.log("render App -= ", this.state.error, me);

        if(this.state.error || !me.channelId) {
          console.log("render error ");
          return <div />
        }
        // false &&
        return (
            <div>
                {!this.state.isNotificationEnabeled &&
                    (<div>
                        <div className={Styles.overlay} />
                        <div
                            className={Styles.popup}
                            style={{background: 'url(notify.png)'}}
                            onClick={this.processNotifications}
                        />
                    </div>)
                }
                <FriendList ucc={this.props.unreadChatCounts} />
            </div>
        );
    }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in App= ", state);
    return {
        me: state.friends.me || {},
        friends: state.friends.friends || [],
        noReload: state.friends.noReload || false,
        meetingData: state.friends.meetingData || null,
        unreadChatCounts: state.friends.unreadChatCounts || {}
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
        },
        setUnreadChatCount: (id, count, msg) => {
            dispatch(setUnreadChatCount(id, count, msg));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);
