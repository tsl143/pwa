const API = 'http://localhost:8081/';

import React from 'react';
import { render as ReactDomRender } from 'react-dom';
import { Route, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import App from './components/App';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import setFCM from './FCM';
import registerServiceWorker from './registerServiceWorker';

const MyApp = props => (
  <MuiThemeProvider>
    <App route={props}/>
  </MuiThemeProvider>
);

ReactDomRender(
    <Provider store={ReduxStore}>
        <HashRouter>
            <div>
                <Route exact path="/" component={MyApp} />
                <Route name="MyApp"  path="?status=:status" component={MyApp} />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);

//setFCM();
registerServiceWorker();
