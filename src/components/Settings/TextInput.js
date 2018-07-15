import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Styles from './styles.scss'

const styles = {
    fullWidth: {
        width: '100%',
    },
};

export default class TextInput extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: props.active || '',
            data: []
        }
    }

    setActive(ev) {
        const active = ev.target.value
        this.setState((prev) => {            
            if(this.props.action) this.props.action(active);
            return { active }
        });
    }

    render() {
        const { hint } = this.props;
        return (
            <TextField
                helperText={hint}
                fullWidth
                margin="normal"
                multiline
                onChange={this.setActive.bind(this)}
            />
        );
    }
}