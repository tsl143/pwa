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
                        console.log(currentToken);
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                })
                .catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                });
            messaging.onTokenRefresh(function() {
                messaging
                    .getToken()
                    .then(function (refreshedToken) {
                        if (currentToken)
                            sendTokenToServer(refreshedToken, channelId);
                    });
            });
        })
        .catch(function(err) {
            console.log('Unable to get permission to notify.', err);
        });

}

function sendTokenToServer(token, channelId) {
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
    })
    .catch(error => {
        console.log('failed', error)
    });
}

