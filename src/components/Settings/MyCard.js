import React, { Component } from 'react';

import {Card, CardHeader, CardText} from 'material-ui/Card';

import Styles from './styles.scss';

export default class MyCard extends Component {
    render() {
        const { title, subtitle, content } = this.props;
        return (
            <Card className={Styles.theCard}>
                <CardHeader
                    title={title}
                    subtitle={subtitle}
                    className={Styles.header}
                />
                <CardText
                    className={Styles.content}
                >
                    {content}
                </CardText>
            </Card>
        );
    }
}