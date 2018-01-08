import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionSnooze from 'material-ui/svg-icons/AV/snooze';
import { Link } from 'react-router-dom';

import Styles from './style.scss';

export default class Header extends Component {

  constructor(props) {
    super(props);
    this.state = {open: false};
  }

  handleToggle(){
    this.setState({open: !this.state.open});
  }

  render() {
    const { name } = this.props;
    
    const homeElement = (name.toLowerCase() != 'friends') ? <Link to="/" /> : <div />
    const notificationElement = (name.toLowerCase() != 'notifications') ? <Link to="/notifications" /> : <div />

    return (
    <div className={Styles.Header}>
      <AppBar 
      	style={{position: 'fixed'}}
      	iconElementLeft={<img src="logo.png"/>}
      	title={name}
      	onTitleClick={this.handleToggle.bind(this)}
      />
      <Drawer open={this.state.open}>
      	<List>
      		<ListItem
            containerElement={ homeElement }
            primaryText="Home"
            leftIcon={
              <ActionHome />
            }
          />
      		<ListItem
            containerElement={ notificationElement }
            primaryText="Notifications"
            leftIcon={
              <ActionSnooze />
            }
          />
      	</List>       
        </Drawer>
      </div>
    );
  }
}
