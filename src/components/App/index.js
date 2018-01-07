import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from '../Header';
import FriendList from '../FriendList';

import Styles from './style.scss';


class List extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Header/>
                <FriendList />
            </div>
        );        
    }
}

const mapDispatchToProps = dispatch => {
    return {
    }
}

const mapStateToProps = state => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(List);