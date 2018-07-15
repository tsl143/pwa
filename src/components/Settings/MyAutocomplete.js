import React, { Component } from 'react';
import AutoComplete from 'material-ui/AutoComplete';

import Styles from './style.scss';

export default class MyAutoComplete extends Component {

    constructor(props) {
        super(props);
        this.state = {
            active: props.active,
            searchText: props.active || ''
        }
    }

    handleUpdateInput(searchText) {
        this.setState({
          searchText,
        });
    };

    handleNewRequest(searchText) {
        this.setState({
            searchText
        });
        if(this.props.action) this.props.action(searchText);
    };

    changeActive(active) {
        this.setState({ active });
        if(this.props.action) this.props.action(active);
    }

    render() {
        const { data, active, hint } = this.props;
        return (
            <div className={Styles.autoComplete}>
                <AutoComplete
                    hintText={hint}
                    searchText={this.state.searchText}
                    onUpdateInput={this.handleUpdateInput.bind(this)}
                    openOnFocus={true}
                    onNewRequest={this.handleNewRequest.bind(this)}
                    dataSource={data}
                    fullWidth={true}
                    popoverProps={{className: Styles.popover} }
                    filter={(searchText, key) => (key.toLowerCase().indexOf(searchText.toLowerCase()) !== -1)}
                    menuCloseDelay={0}
                />
            </div>
        );
    }
}