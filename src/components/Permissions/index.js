import React, {Component} from 'react'
// import setFCM from '../../FCM';
import axios from 'axios'
import {saveLocation, saveFCMtoken} from '../../actions/login'
import Styles from './style.scss';
import {connect} from 'react-redux'

class Permissions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      steps: ["location", "notification"],
      isNotificationEnabeled: false,
      isLocationEnabled: false
    }

    this.locationError = this.locationError.bind(this)
    this.locationSuccess = this.locationSuccess.bind(this)
    this.processNotifications = this.processNotifications.bind(this)
    this.setFCM = this.setFCM.bind(this)
  }

  componentWillMount() {

    this.setState({
      isNotificationEnabeled: localStorage.getItem(`NG_APP_SD_NOTIFICATION`),
      isLocationEnabled: localStorage.getItem(`NG_APP_SD_LOCATION`),
    });
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps != this.props) {
      this.setState({isLocationEnabled: nextProps.userlocation, isNotificationEnabeled: nextProps.fcmToken})
    }
  }

  processNotifications() {
    if (!navigator.onLine) return false;
    this.setState({
        isNotificationEnabeled: true
    });
    localStorage.setItem(`NG_APP_SD_NOTIFICATION`, true);
    localStorage.setItem(`NG_APP_SD_LOCATION`, true);

    if ("geolocation" in navigator && this.props.userlocation == null) {
      /* geolocation is available */
      // get Location
      navigator.geolocation.getCurrentPosition(this.locationSuccess, this.locationError)
    }

    // get Notification
    if(this.props.fcmToken == null) {
      this.setFCM()
    }
  }

  locationSuccess(response) {
    console.log('location success ', response);
    this.props.saveLocation(response)
  }

  locationError(response) {
    console.log('location Error ', response);
    // this.props.saveFCMtoken(response)
  }

  setFCM() {
    const config = {
        apiKey: FIREBASE_APIKEY,
        authDomain: FIREBASE_AUTHDOMAIN,
        databaseURL: FIREBASE_DATABASE_URL,
        projectId: FIREBASE_PROJECT_ID,
        storageBucket: FIREBASE_STORAGE_BUCKET,
        messagingSenderId: FIREBASE_MESSAGING_ID
    };
    try{
        firebase.initializeApp(config);
    }catch(e){}
    console.log('in new setFCM');
    // getting notification permissions
    const messaging = firebase.messaging();
    messaging.requestPermission()
        .then(() => {
            console.log('Notification permission granted.');

            // getting and setting up the token
            messaging.getToken()
                .then((currentToken) => {
                  console.log("currentToken= ", currentToken);
                    if (currentToken) {
                        this.sendTokenToServer(currentToken) //channelId
                        console.log(currentToken);
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                })
                .catch((err) => {
                    // this.saveDenial(channelId)
                    console.log('An error occurred while retrieving token. ', err);
                });
            messaging.onTokenRefresh(() => {
                messaging
                    .getToken()
                    .then((refreshedToken) => {
                      console.log("refreshedToken= ", refreshedToken);
                        if (currentToken)
                            this.sendTokenToServer(refreshedToken); //channelId
                    })
                    .catch(()=> {
                        // this.saveDenial(channelId);
                    })
            });
        })
        .catch((err) => {
            // this.saveDenial(channelId);
            console.log('Unable to get permission to notify.', err);
        });
  }

  sendTokenToServer(token, channelId) {
    this.props.saveFCMtoken(token)
      // const data = {
      //     channelid: channelId,
      //     accessToken: token
      // }
      // axios({
      //     method: 'POST',
      //     url: `${API}fcmtoken`,
      //     data
      // })
      // .then(response => {
      //     console.log('recorded', token)
      // })
      // .catch(error => {
      //     console.log('failed', error)
      // });
  }

  saveDenial(channelId) {
      // firebase
      //     .database()
      //     .ref(`/denial`)
      //     .push({
      //         channelId,
      //         timeStamp: Date.now()
      //     })
  }

  render() {
    let { fcmToken, userlocation} = this.props
    let {isNotificationEnabeled, isLocationEnabled} = this.state
    let view = isLocationEnabled == null || isNotificationEnabeled == null
    console.log("show Permissions ", isLocationEnabled, isNotificationEnabeled, view);
    //!this.state.isNotificationEnabeled

    return (
      <div>
        {
          view &&
            <div>
                <div className={Styles.overlay} />
                <div
                    className={Styles.popup}
                    style={{background: 'url(notify.png)'}}
                    onClick={this.processNotifications}
                />
            </div>
        }
      </div>
    )
  }
}


const mapStateToProps = state => {
  console.log("mapStateToProps in Fblogin= ", state);
    return {
        me: state.friends.me || {},
        login:  state.login.login || {},
        userlocation: state.login.location || null,
        fcmToken: state.login.fcmToken || null,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveLocation: (data) => {
          dispatch(saveLocation(data));
        },
        saveFCMtoken: (data) => {
          dispatch(saveFCMtoken(data));
        },
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Permissions)
