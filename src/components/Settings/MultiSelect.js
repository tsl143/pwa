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

export default class MultiSelect extends Component {

    constructor(props) {
        super(props);
        const { answer = {} } = props;
        
        const active =  (answer.option && answer.option.length > 0) ?  answer.option : [];
        this.state = {
            active,
        }
    }

    changeActive(key) {
        this.setState((prev) => {
            const activePills = [...prev.active];
            if(!(activePills.indexOf(key) > -1)) {
                activePills.push(key);
                if(this.props.action) this.props.action(activePills);
            }
            return { active: activePills }
        });
    }

    deleteActive(data) {
        this.setState((prev) => {
            const activePills = [...prev.active];
            const deletePill = activePills.indexOf(data);
            activePills.splice(deletePill, 1);
            if(this.props.action) this.props.action(activePills);
            return { active: activePills }
        });
    }

    render() {
        const { data, answer } = this.props;
        const keys = Object.keys(data);
        return (
            <div>
                <SelectField
                    value={this.state.active}
                    maxHeight={200}
                    style={styles.fullWidth}
                >
                    {
                        keys.map(k => <MenuItem onClick={this.changeActive.bind(this, k)} value={k} key={k} primaryText={data[k]} />)
                    }
                </SelectField>
                <div className={Styles.pills}>
                    {
                        this.state.active.map(k => {
                            return (
                                <Chip
                                    label={ data[k] }
                                    key={k}
                                    onDelete={this.deleteActive.bind(this,k)}
                                    className={Styles.pill}
                                />
                            )
                        })
                    }
                </div>
            </div>
        );
    }
}