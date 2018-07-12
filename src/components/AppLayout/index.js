import React, {Component} from 'react';
import {Redirect} from 'react-router';

import AppBar from 'material-ui/AppBar';
// import Avatar from "material-ui/Avatar";
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MenuIcon from 'material-ui/svg-icons/navigation/menu';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import {white} from 'material-ui/styles/colors';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import { withStyles } from '@material-ui/core/styles';

class AppLayout extends Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoggedIn: false,
      openDrawer: false,
      reload: false
    }
    this.handleLogout = this.handleLogout.bind(this)
    this.toggleDrawer = this.toggleDrawer.bind(this)
    this.handleAvatarClick = this.handleAvatarClick.bind(this)
  }

  componentWillMount() {
    let loginSession = localStorage.getItem("NG_APP_SD_LOGGEDIN") != null
                      ? JSON.parse(localStorage.getItem("NG_APP_SD_LOGGEDIN"))
                      : false
    console.log("loginSession in AppLayout:  ", loginSession);
    this.setState({isLoggedIn: loginSession}, () => {
      console.log('isLoggedIn set in AppLayout- ', this.state.isLoggedIn);
    })
  }

  toggleDrawer() {
    this.setState({openDrawer: !this.state.openDrawer}, () => {
      console.log('drawer open toggle ', this.state.openDrawer);
    })
  }

  handleAvatarClick() {
    console.log('avatar click -- ');
  }

  handleLogout() {
    // localStorage.removeItem("NG_APP_SD_LOCATION")
    localStorage.removeItem("NG_APP_SD_CHANNELID")
    localStorage.removeItem("NG_APP_SD_LOGGEDIN")
    localStorage.removeItem("NG_APP_SD_LOGINSESSION")
    localStorage.removeItem("NG_APP_SD_USER_DETAILS")
    this.setState({reload: true})
  }

  render() {
    let name = "NearGroup"
    let {isLoggedIn, reload} = this.state
    console.log("isLoggedIn in render state= ", isLoggedIn);

    return (
      <div>
      {
        reload && <Redirect to='/' />
      }
      <AppBar
        style = { {...this.props.style } }
        iconElementLeft = {
              <MenuIcon onClick={this.toggleDrawer} style={{marginTop: 12}}/>
        }
        title = { name }
        iconElementRight = {
          <div style={{padding: 5}} onClick={this.handleLogout}>
            <Avatar
              alt="User Image"
              src="https://s3-us-west-2.amazonaws.com/wisp-image/ng/thumb/50_50_profile_1768136369876451"
            />
          </div>
        }
      />
      <SwipeableDrawer
         open={this.state.openDrawer}
         onClose={this.toggleDrawer}
         onOpen={this.toggleDrawer}
       >
         <div
           tabIndex={0}
           role="button"
           onClick={this.toggleDrawer}
           onKeyDown={this.toggleDrawer}
         >
           {/** sideList **/}
           <p>SwipeableDrawer :) </p>
         </div>
       </SwipeableDrawer>
       <div style={{height: '90vh', backgroundColor: '#DDE1E0'}}>
        {
          isLoggedIn ? this.props.children : <Redirect to='/login' />
        }
       </div>
      </div>
    )
  }
}

export default AppLayout

// {this.props.children}
/**
<IconMenu
    iconButtonElement={
        <IconButton ><MoreVertIcon color={white} /></IconButton>
    }
    targetOrigin={{horizontal: 'right', vertical: 'top'}}
    anchorOrigin={{horizontal: 'right', vertical: 'top'}}
    >
    <MenuItem primaryText="Unfriend" />

</IconMenu>
**/
