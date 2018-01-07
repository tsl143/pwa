import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';

import Header from '../Header';
import FriendList from '../FriendList';

import Styles from './style.scss';


export default class List extends Component {

    constructor(props) {
        super(props);
    }

    render() {

        return (
            <div>
                <Header name="Friends"/>
                <FriendList />
            </div>
        );        
    }
}