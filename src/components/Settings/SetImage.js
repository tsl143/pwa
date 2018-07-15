import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from 'material-ui/MenuItem';
import AddBox from 'material-ui/svg-icons/image/camera-alt';
import Styles from './styles.scss'

const styles = {
    fullWidth: {
        width: '100%',
    },
};

export default class SetImage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: props.active || '',
            data: []
        }
    }



    render() {
        let { answer, hint } = this.props;
        const { option = '' } = answer;
        return (
            <center>
                <span className={Styles.imageHelp}>{hint}</span>
                {
                    option !== '' &&
                    <div className={Styles.profileImg}><img src={option} /></div>
                }
                <div> <AddBox/> </div>

            </center>
        );
    }
}