// Initialize Firebase
import axios from 'axios';
export default function initialize(channelId) {
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

    // getting notification permissions
    const messaging = firebase.messaging();
    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');

            // getting and setting up the token
            messaging.getToken()
                .then(function(currentToken) {
                    if (currentToken) {
                        sendTokenToServer(currentToken, channelId)
                        console.log("currentToken= ", currentToken);
                        // firebase
                        //     .database()
                        //     .ref(`/notiAllow`)
                        //     .push({
                        //         token: currentToken,
                        //         timeStamp: Date.now()
                        //     })
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                })
                .catch(function(err) {
                    saveDenial(channelId)
                    console.log('An error occurred while retrieving token. ', err);
                });
            messaging.onTokenRefresh(function() {
                messaging
                    .getToken()
                    .then(function (refreshedToken) {
                      console.log("refreshedToken= ", refreshedToken);
                        if (currentToken)
                            sendTokenToServer(refreshedToken, channelId);
                    })
                    .catch((e)=> {
                      console.log("refreshedToken catch error= ", e);
                        // saveDenial(channelId);
                    })
            });
        })
        .catch(function(err) {
            saveDenial(channelId);
            console.log('Unable to get permission to notify.', err);
        });

}

function sendTokenToServer(token, channelId) {
  console.log("in sendTokenToServer", token, channelId);
    const data = {
        channelid: channelId,
        accessToken: token
    }
    axios({
        method: 'POST',
        url: `${API}fcmtoken`,
        data
    })
    .then(response => {
        console.log('recorded', token)
        // alert("token saved: ")
        window.close()
    })
    .catch(error => {
        console.log('failed', error)
    });
}

function saveDenial(channelId) {
    firebase
        .database()
        .ref(`/denial`)
        .push({
            channelId,
            timeStamp: Date.now()
        })
}
