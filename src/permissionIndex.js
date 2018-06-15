import React from 'react';
import { render as ReactDomRender } from 'react-dom';
import { Route, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import App from './components/App';
import Chat from './components/Chat';
import Permission from './components/Notifications/permission';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import initialize from "./initializeFirebase";

const MyApp = props => (
  <MuiThemeProvider>
    <Permission route={props}/>
  </MuiThemeProvider>
);
//
// const MyChat = props => (
//     <MuiThemeProvider>
//       <Chat route={props}/>
//     </MuiThemeProvider>
//   );
//
// const FCMPermission = props => (
//     <MuiThemeProvider>
//       <Permission route={props}/>
//     </MuiThemeProvider>
//   );

initialize();
ReactDomRender(
    <Provider store={ReduxStore}>
        <HashRouter>
            <div>
                <Route exact path="/" component={MyApp} />
                {/**
                  <Route exact path="/chat" component={MyChat} />
                <Route exact path="/permission" component={FCMPermission} />
                **/}
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);
registerServiceWorker();
