import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Redirect} from 'react-router'

import FbLogin from '../FbLogin/index';
import GoogleLogin from '../GoogleLogin/index';
import Styles from "./style.scss";
import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

const styles = theme => ({
  root: theme.mixins.gutters({
    margin: "auto",
    /* padding-top: 16px; */
    /* padding-left: 16px; */
    /* padding-right: 16px; */
    /* padding-bottom: 16px; */
    width: "85%",
    padding: "25px 0px",
    height: "auto",
  }),
});

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isLoggedIn: false
    }
  }

  componentDidMount() {
    if(document.getElementById('loading')) document.getElementById('loading').remove();
  }

  componentWillReceiveProps(nextProps) {
    console.log('nextProps in Login= ', nextProps);
    this.setState({isLoggedIn: nextProps.isLoggedIn})
  }

  render() {
    let {classes} = this.props
    console.log("login render ", this.state);
    return (
      <div style={{height: "100vh", backgroundColor: "#d14836", paddingTop: 25}}>
      <div style={{height: "60%",marginTop: 100, width: '100vw'}}>
        <div style={{textAlign: 'center'}}>
          <img style={{width: 100}} src="../../logo.png" />
        </div>
        <div style={{textAlign: 'center'}}>
          <h2 style={{color: 'white'}}>Login</h2>
        </div>
    {/**<Paper className={classes.root} elevation={4}>
    </Paper> **/}
          <div className={Styles.logincontainer}>
            <FbLogin />
            <br /><br />
            <GoogleLogin />
          </div>
      </div>
      {
        this.state.isLoggedIn && <Redirect to="/" />
      }
      </div>
    )
  }
}

const mapStateToProps = state => {
  console.log("mapStateToProps in Fblogin= ", state);
    return {
        login:  state.login.login || {},
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

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Login))
