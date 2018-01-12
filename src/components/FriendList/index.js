import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../Header';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { getFriends, getFriendsCache } from '../../actions/friends';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Styles from './styles.scss'

class FriendList extends Component {

	constructor(props) {
		super(props);
	}

	componentWillMount() {
		this.props.getFriendsCache();
	}

	componentDidMount() {
		if(navigator.onLine) {
			const nowTime = Date.now();
			const thenTime = parseInt(this.props.timestamp,10);
			if(Math.abs(nowTime - thenTime) > 60000) this.props.getFriends();
		}
	}

	populateFriendsList() {
		const { friends } = this.props;
	  	const AvtarUrl = 'https://img.neargroup.me/project/forcesize/65x65/pixelate_3/profile_';
	  	return friends.map( friend => {
	  		return (
	  			<ListItem
					primaryText={friend.name}
					leftAvatar={<Avatar src={`${AvtarUrl}${friend.image_name}`} />}
					rightIcon={<a onClick={() => this.props.letsChat(friend)}><CommunicationChatBubble /></a>}
					key={friend.channelid}
				/>
	  		);
	  	});
	}

  	render() {
  		const { loading } = this.props;
	    return (
			<div>
				<Header name="Friends"/>
				<div className={Styles.FriendList}>
					{loading &&
						<RefreshIndicator
						      size={40}
						      left={10}
						      top={0}
						      status="loading"
						      className={Styles.refresh}
					    />
					}
					<List>
						{this.populateFriendsList()}
					</List>
			    </div>
		    </div>
    	);
  	}
}


const mapDispatchToProps = dispatch => {
    return {
    	getFriends: () =>{
    		dispatch(getFriends());
		},
		getFriendsCache: () =>{
			dispatch(getFriendsCache());
		}
    }
}

const mapStateToProps = state => {
    return {
    	friends: state.friends.list || [],
    	loading: state.friends.isLoading || false,
    	timestamp : state.friends.timestamp || 0,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);
