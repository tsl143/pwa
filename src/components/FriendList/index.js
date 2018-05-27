import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Chip from 'material-ui/Chip';
import { Twemoji } from "react-emoji-render";
import Avatar from 'material-ui/Avatar';
import List from 'material-ui/List/List';
import Divider from 'material-ui/Divider';

import ListItem from 'material-ui/List/ListItem';
import RefreshIndicator from 'material-ui/RefreshIndicator';
import Timestamp from "react-timestamp";

import { setMeeting } from '../../actions/friends';

import Header from '../Header';
import NoFriends from '../NoFriends';
import Styles from './styles.scss'
import { htmlDecode, sortFriendList, formatDate, formatTime } from '../../utility';

class FriendList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			loadCheck: [],
			ucc: {}
		}
		this.handleImg = this.handleImg.bind(this);
		this.handleLastTime = this.handleLastTime.bind(this);
	}

	componentWillMount() {
		localStorage.setItem("CHAT_BOX_CLOSED", true)
		var getUcc = localStorage.getItem("NG_PWA_UNREAD_COUNTS")

		// if(localUcc == null || localUcc == undefined || )
		console.log('getUcc = ', getUcc);
		if(getUcc != undefined && getUcc != null && getUcc != {}) {
			console.log("getUcc ok");
			this.setState({ucc:getUcc})
		} else {
			console.log('getUcc NOT ok ');
			this.setState({ucc: {}})
		}
	}

	componentWillReceiveProps(nextProps) {
		let data = nextProps.unreadChatCounts
		console.log("FirendsList receive props= ", nextProps, Object.keys(data).length);
		// if(Object.keys(data).length == 0) {
		// 	let localdata = JSON.parse(localStorage.getItem("NG_PWA_UNREAD_COUNTS"))
		// 	console.log("localdata= ", data);
		// 	if(localdata == null) {
		// 		data = {}
		// 	}else {
		// 		data = localdata
		// 	}
		// }
		console.log("final frendlist willreceive ucc data= ", data);
		if(Object.keys(data).length != 0) {
			this.setState({ucc: data}, () => {
				console.log("newucc in friendlist: ", this.state.ucc);
			})
		}
	}

	componentDidMount() {
		if(document.getElementById('loading')) document.getElementById('loading').remove();
		if(document.getElementById('fullscreen')) document.getElementById('fullscreen').remove();
	}

	handleImg(id, e) {
		try {
			// to prevent infinite loop if fallback avtar even fails
			if(!this.state.loadCheck.includes(id)) {
				this.setState(prev => {
					const loadCheck = [ ...loadCheck ];
					loadCheck.push(id);
					return { loadCheck }
				})
				e.target.src = AVTAR;
			}

		}catch(e){}
	}

	handleLastTime(t) {
		if(!t || t == '' || t == 0) return '';
		const currentTime = Date.now();
		const currentDay = formatDate(currentTime);
		const chatTime = parseInt(t);
		const chatDay = formatDate(chatTime);
		if(currentDay == chatDay) return <Timestamp time={new Date(chatTime)} format="time" />;
		return chatDay;
	}

	populateFriendsList() {
		console.log("populateFriendsList");
		const { friends, lastChats, me } = this.props;
		const { ucc} = this.state
		console.log('lastChats in populateFriendsList= ', lastChats);
		const sortedFriends = sortFriendList(friends, lastChats) || [];
	  	const AvtarUrl = 'https://img.neargroup.me/project/forcesize/50x50/profile_';
		return sortedFriends.map( friend => {
			console.log("populate friendslist friend= ", friend);
			const sentByMe = (friend.msgFrom == me.channelId) ? true: false;
			console.log("NG_PWA_UNREAD_COUNT of "+friend.meetingId+ " -- " + ucc[friend.meetingId]  );
			if(ucc[friend.meetingId] != undefined && ucc[friend.meetingId] != null ) console.log(" ucc = ", ucc[friend.meetingId]);

			console.log("friend newfriend= ", friend);
			let secondaryText = <p/>
			if(friend.newfriend != undefined) {
				console.log('friend.newfriend present');
				secondaryText = <p>This is your new match!</p>
			} else {
				console.log('friend.newfriend undefined');
				secondaryText = friend.lastMsg ? <p><span>{sentByMe && 'You: '}</span><Twemoji text={htmlDecode(friend.lastMsg.substr(0,200))} /></p> : <p/>
			}

			console.log('final secondaryText= ', secondaryText);

				return (
					<List style={{padding: 0}}>
					<Divider inset component="li" />
	  			<ListItem
					key={friend.channelId}
					leftAvatar={<Avatar src={`${AvtarUrl}${friend.imageUrl}`} onError={this.handleImg.bind(this, friend.channelId)}/>}
					onClick={() => this.props.setMeeting(friend.meetingId)}
					primaryText={<Twemoji text={htmlDecode(friend.name)} />}
					containerElement={<Link to="/chat" />}
					rightIcon={
						(<div style={{float: 'right', width: '26%'}}>
						{Number(ucc[friend.meetingId]) > 0 && (<Chip style={{float: 'left', fontSize: 15, backgroundColor: '#00E676'}}>{ucc[friend.meetingId]}</Chip>) }
						<p className={Styles.lastTime}>
							{/** <span style={{float: 'left', fontSize: 15, color: '#4CAF50'}}>{Number(ucc[friend.meetingId]) > 0 && ucc[friend.meetingId]}</span> **/}
							<span style={{float: 'right', color: Number(ucc[friend.meetingId]) > 0 ? '#00E676' : '' }}>{this.handleLastTime(friend.lastTime)}</span>
						</p>
						</div>)
					}
					secondaryText={
						secondaryText
					}

				/>
				</List>
	  		);
	  	});
	}

  	render() {
			// style={{backgroundColor: Number(ucc[friend.meetingId]) > 0 ? "#E0E0E0" : ''}}
			console.log('render FriendsList', this.state);
		const { loading, friends } = this.props;
	    return (
			<div>
				<Header name="Friends" style={{backgroundColor: '#AA00FF'}} />
				<div className={Styles.FriendList}>
					{loading &&
						<div>

							<RefreshIndicator
								size={40}
								left={10}
								top={0}
								status="loading"
								className={Styles.refresh}
							/>
						</div>
					}
					{
						friends.length === 0 &&
						!loading &&
						<NoFriends />
					}
					{
						friends.length !== 0 &&

							this.populateFriendsList()

					}
			    </div>
		    </div>
    	);
  	}
}

const mapStateToProps = state => {
	console.log("mapStateToProps in FriendList = ", state);
	if(state.friends.unreadChatCounts != undefined) {
		console.log('unreadCatArray return= ', state.friends.unreadChatCounts || null);
	}
    return {
			friends: state.friends.friends || [],
			me: state.friends.me || {},
	    loading: state.friends.isLoading || false,
			timestamp : state.friends.timestamp || 0,
			lastChats: state.friends.lastChats || {},
			unreadChatCounts: state.friends.unreadChatCounts || {}
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setMeeting: meetingId =>{
            dispatch(setMeeting(meetingId));
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FriendList);
