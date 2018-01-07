import React, { Component } from 'react';
import { connect } from 'react-redux';

import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import ListItem from 'material-ui/List/ListItem';
import RefreshIndicator from 'material-ui/RefreshIndicator';

import { getFriends, getFriendsCache } from '../../actions/ng';
import CommunicationChatBubble from 'material-ui/svg-icons/communication/chat-bubble';
import Styles from './styles.scss'

class FriendList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			friends: []
		}
	}

	componentWillMount() {
		this.props.getFriendsCache();
	}

	componentDidMount() {
		if(navigator.onLine) this.props.getFriends();
	}

	componentWillReceiveProps(props) {
		const { friends } = props;
	}

	populateFriendsList() {
		const { friends } = this.props;
	  	const AvtarUrl = 'https://img.neargroup.me/project/forcesize/65x65/pixelate_3/profile_';
	  	return friends.map( friend => {
	  		return (
	  			<ListItem
					primaryText={friend.name}
					leftAvatar={<Avatar src={`${AvtarUrl}${friend.image_name}`} />}
					rightIcon={<CommunicationChatBubble />}
					key={friend.channelid}
				/>
	  		);
	  	});
	}

  	render() {
  		const { loading } = this.props;
	    return (
	    	<div>
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
    	friends: state.ng.list || [],
    	loading: state.ng.isLoading || false,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);
