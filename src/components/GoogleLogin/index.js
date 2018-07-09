import React, { Component } from 'react';
import { connect } from 'react-redux';
// import FriendList from '../FriendList';
// import Chat from '../Chat';
import {saveLoginSession, saveChannelId } from '../../actions/login';
// import setFCM from '../../FCM';
import querystring from 'query-string';
import GoogleLogin from 'react-google-login'
import FontAwesome from 'react-fontawesome'

// import Styles from './style.scss';

class FbLogin extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: false,
            firstCall: true,
            loginType: 'google'
        };

        this.responseGoogle = this.responseGoogle.bind(this)

    }

    componentWillReceiveProps(nextProps) {
      console.log('nextProps in GoogleLogin= ', nextProps);
    }

    responseGoogle(response) {
      console.log("google response-- ", response, this.props);

      if(response.error) {
        localStorage.setItem("NG_APP_SD_LOGGEDIN", false)
        // localStorage.setItem("NG_APP_SD_LOGINSESSION", JSON.stringify(response))
      } else {
        localStorage.setItem("NG_APP_SD_LOGGEDIN", true)
        localStorage.setItem("NG_APP_SD_LOGINSESSION", JSON.stringify(response))
        localStorage.setItem("NG_APP_SD_CHANNELID", JSON.stringify(response.googleId))
        this.props.saveChannelId(response.googleId)
        this.props.saveLoginSession({login_method: this.state.loginType, ...response})
      }


    }

    render() {
      return (<div>

        <GoogleLogin
          clientId="590817841198-ud95n1iukoipp3jmg8ilg84j53527j8b.apps.googleusercontent.com"
          buttonText="Login"
          onSuccess={this.responseGoogle}
          onFailure={this.responseGoogle}
          style={{backgroundColor: '#3e5c9a', width: 220, border: 'none', padding: 5, color: 'white',height: 40,
            fontSize: 16}}
        >
          <FontAwesome
            name='google'
          />
          <span> Login with Google</span>
        </GoogleLogin>
      </div>)
    }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in Googlelogin= ", state);
    return {
        login:  state.login.login || {},
        isLoggedIn: state.login.isLoggedIn || false
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
