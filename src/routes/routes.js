import React, {Component} from 'react';
import {Link, Switch} from 'react-router';
import {BrowserRouter, Route} from 'react-router-dom';
import { connect } from 'react-redux';

import AppLayout from "../components/AppLayout";
import App from '../components/App';
import Chat from '../components/Chat';
import Login from '../components/Login';
import Permission from '../components/Notifications/permission';
import Apphome from '../components/AppHome/index';
import Discover from '../components/Discover/discover';
import Backdrop from '../components/test'
import createBrowserHistory from 'history/createBrowserHistory'

const history = createBrowserHistory()

class Routes extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log("nextProps in route= ", nextProps);
    if(nextProps.isLoggedIn != this.state.isLoggedIn) {
      this.setState({isLoggedIn: nextProps.isLoggedIn})
    }
  }

  render() {
    return (
      <BrowserRouter history={history}>
        <div>
        {/**
        <Switch>
          <Route exact path="/login" component={Login} />
        </Switch>
        <Switch>
        **/}
          <Route exact path="/login" component={Login} />
          <Route exact path="/" component={() => (<AppLayout><Apphome/></AppLayout>)} />
          <Route exact path="/test" component={Backdrop} />
          <Route exact path="/discover" component={() => (<AppLayout><Discover /></AppLayout>)} />
        {/**
        </Switch>
        **/}
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in route= ", state);
    return {
        isLoggedIn: state.login.isLoggedIn || false
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveLoginSession: (data) => {
          dispatch(saveLoginSession(data));
        }
    }
}


export default connect(mapStateToProps, mapDispatchToProps)(Routes)
