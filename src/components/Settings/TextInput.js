import React, { Component } from 'react';
import TextField from '@material-ui/core/TextField';
import Styles from './styles.scss'

export default class TextInput extends Component {

    constructor(props) {
        super(props);
        const { answer = {} } = props;
        this.state = {
            text: answer.option || ''
        }
    }

    setActive(ev) {
        const text = ev.target.value;
        this.setState((prev) => {            
            if(this.props.action) this.props.action(text);
            return { text }
        }); 
    }

    render() {
        const { hint, answer = {} } = this.props;
        const { text = '' } = this.state;
        return (
            <TextField
                helperText={hint}
                fullWidth
                margin="normal"
                multiline
                onChange={this.setActive.bind(this)}
                value={text}
            />
        );
    }
}