import React, { Component } from 'react';
import { connect } from 'react-redux';

import FriendList from '../FriendList';
import Chat from '../Chat';
import { getFriends, getFriendsCache } from '../../actions/friends';

import Styles from './style.scss';

class List extends Component {

    constructor(props) {
        super(props);
        this.state = {
            screen: 'list',
            friendData: {},
            error: false
        };
        this.letsChat = this.letsChat.bind(this);
        this.toggleScreen = this.toggleScreen.bind(this);
    }

    componentWillMount() {
        this.props.getFriendsCache();
    }

    componentDidMount() {
        if(navigator.onLine){
            const searchText = this.props.route.location.search;
            const searchParams = searchText.split('=');
            
            if(searchParams.length > 2) this.setState({ error: true });

            const authId = searchParams.pop();
            this.props.getFriends(authId);
        }
    }

    toggleScreen(screen) {
        this.setState({
            screen,
            friendData: {}
        })
    }

    letsChat(friendData) {
        this.setState({
            screen: 'chat',
            friendData
        });
    }

    render() {
        const { me } = this.props;

        if(this.state.error || !me.channelId) return <div />;
        return (
            <div>
                {this.state.screen === 'list' &&
                    <div>
                        <FriendList letsChat={this.letsChat}/>
                    </div>
                }
                {this.state.screen === 'chat' &&
                    <div>
                        <Chat toggleScreen={this.toggleScreen} fromId={me.channelId} data={this.state.friendData} />
                    </div>
                }
            </div>
        );        
    }
}

const mapStateToProps = state => {
    return {
        me: state.friends.me || {}
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getFriends: authId =>{
            dispatch(getFriends(authId));
        },
        getFriendsCache: () =>{
            dispatch(getFriendsCache());
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);