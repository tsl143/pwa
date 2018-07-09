import React from 'react';
import { render as ReactDomRender, Switch } from 'react-dom';
import { Route, HashRouter, BrowserRouter  } from 'react-router-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import App from './components/App';
import Chat from './components/Chat';
import Login from './components/Login';
import Permission from './components/Notifications/permission';
import Apphome from './components/AppHome/index';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';
import initialize from "./initializeFirebase";

import AppLayout from "./components/AppLayout"
import Routes from './routes/routes.js'

// const MyApp = props => (
//   <MuiThemeProvider>
//     <App route={props}/>
//   </MuiThemeProvider>
// );
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
//
// const AppHome = props => (
//     <MuiThemeProvider>
//       <Apphome route={props}/>
//     </MuiThemeProvider>
//   );

initialize();

ReactDomRender(
    <Provider store={ReduxStore}>
      <MuiThemeProvider>
        <Routes />

        {/**
          <HashRouter>
                <div>
                <Switch>
                <Route exact path="/#/login" component={Login} />
                <Route exact path="/" component={Apphome} />

                <AppLayout>
                </Switch>
                </AppLayout>
                </div>
        </HashRouter>
      **/}
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
);
registerServiceWorker();
