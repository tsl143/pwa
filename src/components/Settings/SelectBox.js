import React, { Component } from 'react';
import Select from '@material-ui/core/Select';
import MenuItem from 'material-ui/MenuItem';
import Styles from './styles.scss'

const styles = {
    fullWidth: {
        width: '100%',
    },
};

export default class SelectBox extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: props.active || '',
            data: []
        }
    }

    componentDidMount() {
        let { data = [], id = '', answer } = this.props;
        if(id === 'birthYear' ) {
            this.setState({ data: this.makeDate(), active: parseInt(answer.option, 10) || '' });
        } else {
            this.setState({ data });
        }
    }

    setActive(ev) {
        const active = ev.target.value
        this.setState((prev) => {            
            if(this.props.action) this.props.action(active);
            return { active }
        });
    }

    makeDate() {
        const currentYear = (new Date).getFullYear();
        const maxYear = currentYear - 13;
        const yearsArr = [];
        for(let i = maxYear; i > maxYear - 50; i--) {
            yearsArr.push(i);
        }
        return yearsArr;
    }

    render() {
        let { data = [], active } = this.state;
        return (
            <Select
                value={active}
                onChange={this.setActive.bind(this)}
                style={styles.fullWidth}
            >
                { data.map(yr => <MenuItem value={yr} key={yr}>{yr}</MenuItem>) }
            </Select>
        );
    }
}