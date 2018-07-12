import React, { Component } from 'react';
import { connect } from 'react-redux';
import Fontawesome from 'react-fontawesome';
// import FriendList from '../FriendList';
// import Chat from '../Chat';
import {saveLoginSession, saveChannelId } from '../../actions/login';
// import setFCM from '../../FCM';
import querystring from 'query-string';
import FacebookLogin from "react-facebook-login"

import './style.css';

class FbLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            firstCall: true,
            loginType: 'fb'
        };

        this.statusChangeCallback = this.statusChangeCallback.bind(this)
        this.checkLoginState = this.checkLoginState.bind(this)
        this.responseFacebook = this.responseFacebook.bind(this)
        this.componentClicked = this.componentClicked.bind(this)
        this.loginFailure = this.loginFailure.bind(this)
    }

    componentDidMount() {
        // FB.getLoginStatus(function(response) {
        //   console.log("login status= ", response, that);
        //   that.statusChangeCallback(response);
        // });
      // Load the Facebook JS SDK
      // (function(d, s, id) {
      // 	var js, fjs = d.getElementsByTagName(s)[0];
      // 	if (d.getElementById(id)) return;
      // 	js = d.createElement(s); js.id = id;
      // 	js.src = "//connect.facebook.net/en_US/sdk.js";
      // 	fjs.parentNode.insertBefore(js, fjs);
      // }(document, 'script', 'facebook-jssdk'));
      //
      // let that = this
      //
      // window.fbAsyncInit = function() {
      //   FB.init({
      //     appId      : '1407983142860536',
      //     cookie     : true,  // enable cookies to allow the server to access
      //                         // the session
      //     xfbml      : true,  // parse social plugins on this page
      //     version    : 'v2.8' // use graph api version 2.8
      //   });

        // Now that we've initialized the JavaScript SDK, we call
        // FB.getLoginStatus().  This function gets the state of the
        // person visiting this page and can return one of three states to
        // the callback you provide.  They can be:
        //
        // 1. Logged into your app ('connected')
        // 2. Logged into Facebook, but not your app ('not_authorized')
        // 3. Not logged into Facebook and can't tell if they are logged into
        //    your app or not.
        //
        // These three cases are handled in the callback function.

        // FB.getLoginStatus(function(response) {
        //   console.log("login status= ", response, that);
        //   that.statusChangeCallback(response);
        // });

      // };
    }

    // This is called with the results from from FB.getLoginStatus().
  statusChangeCallback(response) {
    console.log('statusChangeCallback');
    console.log(response);
    // The response object is returned with a status field that lets the
    // app know the current login status of the person.
    // Full docs on the response object can be found in the documentation
    // for FB.getLoginStatus().
    // if (response.status === 'connected') {
    //   // Logged into your app and Facebook.
    //   // this.testAPI();
    //   console.log("save fb login session");
    //   this.props.saveLoginSession({...response, login_method: this.state.loginType })
    //   localStorage.setItem("NG_APP_SD_LOGGEDIN", true)
    //   localStorage.setItem("NG_APP_SD_LOGINSESSION", JSON.stringify(response))
    // } else {
    //   // The person is not logged into your app or we are unable to tell.
    //   console.log("save fb logout session");
    //   localStorage.setItem("NG_APP_SD_LOGGEDIN", false)
    //   // document.getElementById('status').innerHTML = 'Please log ' + 'into this app.';
    // }
  }

    // Here we run a very simple test of the Graph API after login is
    // successful.  See statusChangeCallback() for when this call is made.
    // testAPI() {
    //   console.log('Welcome!  Fetching your information.... ');
    //   FB.api('/me', function(response) {
    //     console.log('Successful login for: ' + response.name);
    //
    //   });
    // }

    // This function is called when someone finishes with the Login
    // Button.  See the onlogin handler attached to it in the sample
    // code below.
    checkLoginState() {
      // let that = this
      // FB.getLoginStatus(function(response) {
      //   console.log("status on login= ", response);
      //   that.statusChangeCallback(response);
      // });
    }

    fblogout() {
      console.log('in fblogout');
      // FB.logout(function(response) {
      //    // Person is now logged out
      //    console.log("fb logout response");
      // });
    }

    responseFacebook(response) {
      console.log('login by module reaponse ', response);
      let user_details = {
        imageUrl: response.picture.data.url,
        name: response.name,
        email: response.email,
        accessToken: response.accessToken,
        channelId: response.id
      }
      localStorage.setItem("NG_APP_SD_LOGGEDIN", true)
      localStorage.setItem("NG_APP_SD_CHANNELID", JSON.stringify(response.id))
      localStorage.setItem("NG_APP_SD_LOGINSESSION", JSON.stringify(response))
      localStorage.setItem("NG_APP_SD_USER_DETAILS", JSON.stringify(user_details))
      // this.props.saveLoginSession({login_method: this.state.loginType, ...response})
      this.props.saveChannelId(response.id)
      this.props.saveLoginSession({login_method: this.state.loginType, ...response})
    }

    componentClicked() {
      console.log('fb login clicked ');
    }

    loginFailure() {
      console.log('fb login falied');
      localStorage.setItem("NG_APP_SD_LOGGEDIN", false)
    }

    render() {
      return (<div>
        {/** <button class="fb-login-button" data-size="medium" data-auto-logout-link="true" data-onlogin={this.checkLoginState}></button> **/}
        {/** <div className="fb-login-button" data-max-rows="1" data-size="medium" data-button-type="continue_with"  data-show-faces="false" data-auto-logout-link="true" data-use-continue-as="false" data-onlogin="this.checkLoginState"></div> **/}
        <FacebookLogin
          appId="1407983142860536"
          autoLoad={true}
          fields="name,email,picture"
          onClick={this.componentClicked}
          callback={this.responseFacebook}
          onFailure={this.loginFailure}
          icon={<Fontawesome name="facebook" />}
        />
      </div>)
    }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in Fblogin= ", state);
    return {
        me: state.friends.me || {},
        friends: state.friends.friends || [],
        noReload: state.friends.noReload || false,
        meetingData: state.friends.meetingData || null,
        unreadChatCounts: state.friends.unreadChatCounts || {},
        isOtherOnline: state.friends.isOtherOnline || {},

        login:  state.login.login || {}
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveLoginSession: (data) => {
          dispatch(saveLoginSession(data));
        },
        saveChannelId: (data) => {
          dispatch(saveChannelId(data));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FbLogin);
