import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Switch,Route, Redirect } from 'react-router';
import { Link } from 'react-router-dom';
import {saveLoginSession } from '../../actions/login';
import AppLayout from "../AppLayout";
// import NGApp from '../NGApp';
// import FriendList from '../FriendList';
// import Chat from '../Chat';
// import {setUnreadChatCount, getFriends, getFriendsCache, getLastMsg, getFriendsChat, processChat } from '../../actions/friends';
// import setFCM from '../../FCM';
import FbLogin from '../FbLogin/index';
import querystring from 'query-string';
import Permissions from '../Permissions'
// import Onboarding from '../Onboarding/onboarding'
import Discover from '../Discover/discover'
// import Styles from './style.scss';

class Home extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            firstCall: true,
            loggedIn: false,
            isNotificationEnabeled: null,
            isLocationEnabled: null
        };

    }

    componentWillMount() {
      // let loginCache = localStorage.getItem("NG_APP_LOGGEDIN")
      // let newstate = {}
      // if(loginCache != null) {
      //   newstate['loggedIn'] = loginCache
      // }
      this.setState({
        isNotificationEnabeled: localStorage.getItem(`NG_APP_SD_NOTIFICATION`),
        isLocationEnabled: localStorage.getItem(`NG_APP_SD_LOCATION`),
      });
    }

    componentDidMount() {
      if(document.getElementById('loading')) document.getElementById('loading').remove();
    }

    componentWillReceiveProps(nextProps) {
      console.log('componentWillReceiveProps--');
      if(nextProps != this.props) {
        console.log('componentWillReceiveProps Apphome ', nextProps, this.props);
        let login = nextProps.login
        if(login && login.status == 'connected') {
          this.setState({loggedIn: true})
        } else {
          this.setState({loggedIn: false})
        }
        this.setState({isLocationEnabled: nextProps.userlocation, isNotificationEnabeled: nextProps.fcmToken})
      }
    }

    render() {
      console.log("AppHome render= ", this.props);
      // let noti_permission = localStorage.getItem("NG_APP_SD_NOTIFICATION")
      // if(noti_permission == null) {
      //   noti_permission = false
      // }
      // let location_permission = localStorage.getItem("NG_APP_SD_LOCATION")
      // if(location_permission == null) {
      //   location_permission = false
      // }
      let {isNotificationEnabeled, isLocationEnabled} = this.state
      let permissions = isLocationEnabled != null // || isNotificationEnabeled == null
      // noti_permission && location_permission
      console.log('permissions in AppHome ', permissions, isNotificationEnabeled, isLocationEnabled);
      // if(this.state.loggedIn) {
      //   return <NGApp />
      // } else {
      //
      // }
        return (
        <div style={{height: '100vh', width: '100vw'}}>
          <Permissions />
          {permissions == true  && <Redirect to="/discover" />}
          {/** <Discover /> **/}

        </div>
        )
    }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in AppHome= ", state);
    return {
        me: state.friends.me || {},
        fcmToken: state.login.fcmToken || null,
        userlocation: state.login.location || null,
        login: state.login.login || {},
    }
}

const mapDispatchToProps = dispatch => {
    return {
        // getFriends: authId => {
        //     dispatch(getFriends(authId));
        // },
        // getFriendsCache: () => {
        //     dispatch(getFriendsCache());
        // },
        // getFriendsChat: (channelId, newFriends) => {
        //     dispatch(getFriendsChat(channelId, newFriends));
        // },
        // getLastMsg: (id, msg) => {
        //     dispatch(getLastMsg(id, msg));
        // },
        // setUnreadChatCount: (id, count, msg) => {
        //     dispatch(setUnreadChatCount(id, count, msg));
        // },
        // processChat: (obj, meetingid,  me, isOtherOnline) => {
        //   dispatch(processChat(obj, meetingid, me, isOtherOnline));
        // },
        saveLoginSession: (data) => {
          dispatch(saveLoginSession(data));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
