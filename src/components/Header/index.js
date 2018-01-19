import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import AppBar from 'material-ui/AppBar';
import Avatar from 'material-ui/Avatar';
import ActionBack from 'material-ui/svg-icons/hardware/keyboard-backspace';
import {white500} from 'material-ui/styles/colors';

import Styles from './style.scss';

export default class Header extends Component {

    constructor(props) {
        super(props);
        this.state = { open: false };
    }

    handleToggle() {
        this.setState({ open: !this.state.open });
    }

    render() {
        const { name } = this.props;
		const avtar = this.props.avtar || 'logo.png';

        return ( 
        	<div className = { Styles.Header } >
            <AppBar
            	style = { { position: 'fixed' } }
            	iconElementLeft = {
                    <div className={Styles.avtar}>
                        {
                            this.props.action &&
                            this.props.action === 'home' &&
                            <Link to="/">
                                <ActionBack color={'white'}/>
                            </Link>
                        }
                        <Avatar src={avtar} />
                    </div>
                }
            	title = { name }/>
            </div>
        );
    }
}