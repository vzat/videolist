import React, { Component } from 'react';
import './css/App.css';

import { Card, Image } from 'semantic-ui-react';

class SubBox extends Component {
    render() {
        const { subBox } = this.props;
        const currentTime = (new Date());
        const videos = subBox.map((index, value) => (
            <Card href = {subBox[value].url} >
                <Image src = {subBox[value].thumbnail.url} />
                <Card.Content>
                    <Card.Header> {subBox[value].title} </Card.Header>
                    <Card.Meta>
                        {subBox[value].channel}
                    </Card.Meta>
                    <Card.Meta>
                        {
                            currentTime - new Date(subBox[value].publishedAt) < 360000 &&
                            Math.trunc((currentTime - new Date(subBox[value].publishedAt)) / 60000) + ' minute(s) ago'
                        }
                        {
                            currentTime - new Date(subBox[value].publishedAt) > 360000 && currentTime - new Date(subBox[value].publishedAt) < 86400000 &&
                            Math.trunc((currentTime - new Date(subBox[value].publishedAt)) / 3600000) + ' hour(s) ago'
                        }
                        {
                            currentTime - new Date(subBox[value].publishedAt) > 86400000 &&
                            Math.trunc((currentTime - new Date(subBox[value].publishedAt)) / 86400000) + ' day(s) ago'
                        }
                    </Card.Meta>
                </Card.Content>
            </Card>
        ));

        return (
            <div className = 'SubBox'>
                <Card.Group stackable>
                    {videos}
                </Card.Group>
            </div>
        );
    }
}

export default SubBox;
