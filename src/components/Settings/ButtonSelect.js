import React, { Component } from 'react';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import Styles from './styles.scss'

const styles = {
    fullWidth: {
        width: '100%',
    },
};

export default class ButtonSelect extends Component {

    constructor(props) {
        super(props);
        const { answer = {} } = props;
        this.state = {
            active: answer.option || '',
        }
    }

    setActive(active) {
        this.setState((prev) => {            
            if(this.props.action) this.props.action(active);
            return { active }
        });
    }

    render() {
        const { data, answer } = this.props;
        return (
            <div>
                {
                    data.map(m => <MenuItem
                        value={m}
                        key={m}
                        primaryText={m}
                        className={m===this.state.active ? Styles.activeBtn : ''}
                        onClick={this.setActive.bind(this, m)}
                    />)
                }
                
            </div>
        );
    }
}