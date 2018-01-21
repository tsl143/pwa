export default function initialize() {
    const config = {
        apiKey: "AIzaSyAlity13cdD9lp9YGXwcBTxlcC6DRdWMMs",
        authDomain: "test-neargroup.firebaseapp.com",
        databaseURL: "https://test-neargroup.firebaseio.com",
        projectId: "test-neargroup",
        storageBucket: "test-neargroup.appspot.com",
        messagingSenderId: "609331358783"
    };
    try{
        firebase.initializeApp(config);
    }catch(e){}
}
