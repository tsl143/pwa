import React, { Component } from 'react';
import { connect } from 'react-redux';

import Header from '../Header';
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Styles from './styles.scss'

class FriendList extends Component {

	constructor(props) {
		super(props);
	}

	populateFriendsList() {
		const { friends, lastChats } = this.props;
	  	const AvtarUrl = 'https://img.neargroup.me/project/forcesize/50x50/profile_';
	  	return friends.map( friend => {
	  		return (
	  			<ListItem
					key={friend.channelId}
					leftAvatar={<Avatar src={`${AvtarUrl}${friend.imageUrl}`} />}
					onClick={() => this.props.letsChat(friend)}
					primaryText={friend.name}
					secondaryText={lastChats[friend.meetingId] && lastChats[friend.meetingId].msg}
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

const mapStateToProps = state => {
    return {
    	friends: state.friends.friends || [],
    	loading: state.friends.isLoading || false,
		timestamp : state.friends.timestamp || 0,
		lastChats: state.friends.lastChats || {}
    }
}

export default connect(mapStateToProps)(FriendList);
