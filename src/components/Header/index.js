import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
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
    return (
    <div className={Styles.Header}>
      <AppBar 
      	style={{position: 'fixed'}}
      	iconElementLeft={<img src="logo.png"/>}
      	title={this.props.name}
      	//onTitleClick={this.handleToggle.bind(this)}
      />
      <Drawer open={this.state.open}>
      	<List>
      		<ListItem>
      			<Link to="/">Home</Link>
      		</ListItem>
      		<ListItem>
      			<Link to="/notifications">Notifications</Link>
      		</ListItem>
      	</List>       
        </Drawer>
      </div>
    );
  }
}
