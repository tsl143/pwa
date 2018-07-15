import React, { Component } from 'react';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

import Styles from './style.scss';

const styles = {
    block: {
      maxWidth: 250,
    },
    radioButton: {
      marginBottom: 16
    },
  };

export default class OptionBox extends Component {

    constructor(props) {
        super(props);
    }

    changeActive(ev, active) {
        if(this.props.action) this.props.action(active);
    }

    render() {
        const { data, action } = this.props;
        const { tabs, active} = data;
        return (
            <RadioButtonGroup
                onChange={this.changeActive.bind(this)}
                defaultSelected={active}
            >
                {
                    tabs.map(tab => 
                        <RadioButton
                            value={tab.key}
                            label={tab.value}
                            style={styles.radioButton}
                        />
                    )
                }
            </RadioButtonGroup>
        );
    }
}