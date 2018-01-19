const API = 'http://localhost:8081/';

import React from 'react';
import { render as ReactDomRender } from 'react-dom';
import { Route, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import App from './components/App';
import Chat from './components/Chat';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import registerServiceWorker from './registerServiceWorker';

const MyApp = props => (
  <MuiThemeProvider>
    <App route={props}/>
  </MuiThemeProvider>
);

const MyChat = props => (
    <MuiThemeProvider>
      <Chat route={props}/>
    </MuiThemeProvider>
  );

ReactDomRender(
    <Provider store={ReduxStore}>
        <HashRouter>
            <div>
                <Route exact path="/" component={MyApp} />
                <Route exact path="/chat" component={MyChat} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);
registerServiceWorker();
