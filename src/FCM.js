// Initialize Firebase
import axios from 'axios';
export default function initialize() {

    const config = {
        apiKey: "AIzaSyAlity13cdD9lp9YGXwcBTxlcC6DRdWMMs",
        authDomain: "test-neargroup.firebaseapp.com",
        databaseURL: "https://test-neargroup.firebaseio.com",
        projectId: "test-neargroup",
        storageBucket: "test-neargroup.appspot.com",
        messagingSenderId: "609331358783"
    };
    firebase.initializeApp(config);

    // getting notification permissions
    const messaging = firebase.messaging();
    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');

            // getting and setting up the token
            messaging.getToken()
                .then(function(currentToken) {
                    if (currentToken) {
                        sendTokenToServer(currentToken)
                        console.log(currentToken);
                    } else {
                        console.log('No Instance ID token available. Request permission to generate one.');
                    }
                })
                .catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                });
        })
        .catch(function(err) {
            console.log('Unable to get permission to notify.', err);
        });

}

function sendTokenToServer(token) {
    const data = {
        channelid: "2c4049be7a41473d8b743a816bed041b",
        accessToken: token
    }
    axios({
        method: 'POST',
        url: 'https://temp.neargroup.me/ag/fcmtoken',
        data
    })
    .then(response => {
        console.log('recorded', token)
    })
    .catch(error => {
        console.log('failed', error)
    });
}

