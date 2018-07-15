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
        this.state = {
            active: props.active || [],
        }
    }

    changeActive(ev, index) {
        const text = this.props.data[index];
        this.setState((prev) => {
            const activePills = [...prev.active];
            if(!activePills.find(a => a.index === index)) {
                activePills.push({ text, index });
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
        const { data } = this.props;
        return (
            <div>
                <SelectField
                    value={this.state.active}
                    onChange={this.changeActive.bind(this)}
                    maxHeight={200}
                    style={styles.fullWidth}
                >
                    {
                        data.map(yr => <MenuItem value={yr} key={yr} primaryText={yr} />)
                    }
                </SelectField>
                <div className={Styles.pills}>
                    {
                        this.state.active.map(a => {
                            return (
                                <Chip
                                    label={ a.text }
                                    key={a.index}
                                    onDelete={this.deleteActive.bind(this,a)}
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