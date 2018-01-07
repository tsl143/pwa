import React from 'react';
import { render as ReactDomRender } from 'react-dom';
import { Route, HashRouter } from 'react-router-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import App from './components/App';
import Notifications from './components/Notifications';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import setFCM from './FCM';
import registerServiceWorker from './registerServiceWorker';

const MyApp = () => (
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
);

ReactDomRender(
    <Provider store={ReduxStore}>
        <HashRouter>
            <div>
                <Route exact path="/" component={MyApp} />
                <Route exact path="/notifications" component={
                    () => (
                        <MuiThemeProvider>
                            <Notifications />
                        </MuiThemeProvider>
                    )
                } />
            </div>
        </HashRouter>
    </Provider>,
    document.getElementById('app')
);

setFCM();
registerServiceWorker();
