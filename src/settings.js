import React from 'react';
import { render as ReactDomRender } from 'react-dom';
import { Route, HashRouter  } from 'react-router-dom';
import { Provider } from 'react-redux';

import ReduxStore from './reducers/store';
import Settings from './components/Settings';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

ReactDomRender(
    <Provider store={ReduxStore}>
      <MuiThemeProvider>
        {
            <HashRouter>
                <Route exact path="/settings" component={Settings} />
            </HashRouter>
        }
      </MuiThemeProvider>
    </Provider>,
    document.getElementById('app')
);