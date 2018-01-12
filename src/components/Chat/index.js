import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import TextField from 'material-ui/TextField';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import {grey400, darkBlack, lightBlack} from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionSend from 'material-ui/svg-icons/content/send';

import Header from '../Header';
//import { getNotifications, getNotificationsCache } from '../../actions/notification';

import Styles from './style.scss';


export default class Chat extends Component {

    constructor(props) {
        super(props);
        this.state = {
        	message: ''
        }
        this.handleMsg = this.handleMsg.bind(this);
        this.sendPlz = this.sendPlz(this);
    }

    componentWillMount() {
        //this.props.getNotificationsCache();
    }

    componentDidMount() {
        // if(navigator.onLine) {
        //     const nowTime = Date.now();
        //     const thenTime = parseInt(this.props.timestamp,10);
        //     if(Math.abs(nowTime - thenTime) > 60000) this.props.getNotifications();
        // }
    }

    handleMsg(prop,message) {
    	this.setState({
    		message
    	})
    }

    sendPlz() {
		firebase.push({
			uId: 1234,
			msg: this.state.message
      	});
      	this.setState({
    		message: ''
    	})
    }
    

    render() {
        //const { loading } = this.props;
        return (
            <div>
                <Header name="Chat"/>
                <div className={Styles.ChatBox}>
                    
                    <div className={Styles.actionBtns}>
                        <TextField
                        	onChange={this.handleMsg}
                            fullWidth={true}
                            hintText="letsGo"
                        />
                        <a onClick={this.sendPlz}><ActionSend /></a>
                    </div>
                </div>
            </div>
        );        
    }
}

// const mapDispatchToProps = dispatch => {
//     return {
//         getNotifications: () =>{
//             dispatch(getNotifications());
//         },
//         getNotificationsCache: () =>{
//             dispatch(getNotificationsCache());
//         }
//     }
// }

// const mapStateToProps = state => {
//     return {
//         notifications: state.notifications.list || [],
//         loading: state.notifications.isLoading || false,
//         timestamp : state.notifications.timestamp || 0,
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(Chat);
