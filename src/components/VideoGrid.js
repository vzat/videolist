import React, { Component } from 'react';
import './css/VideoGrid.css';

import { Grid, Row, Col } from 'react-bootstrap';

import common from './lib/common';

class VideoGrid extends Component {
    render() {
        const {thumbnail, length, title, channelTitle, views, publishedAt} = this.props;
        const thumbnailStyle = {
            backgroundImage: 'url(' + thumbnail + ')',
            backgroundSize: "contain",
            width: "225px",
            height: "126px"
        }

        return (
            <Grid className = 'VideoGrid'>
                <Row className = 'grid-row'>
                    <div className = 'thumbnail-container' style = {thumbnailStyle}>
                        <div className = 'video-length'> {length} </div>
                    </div>
                </Row>

                <Row className = 'grid-row'>
                    { common.trimStr(title, 50) }
                </Row>

                <Row className = 'grid-row-sec'>
                    { common.trimStr(channelTitle, 25) }
                </Row>

                <Row className = 'grid-row-sec'>
                    <div className = 'left-col'> { common.numToShortStr(views) } </div>
                    <div className = 'right-col'> { common.timePassed(publishedAt) } </div>
                </Row>
            </Grid>
        );
    }
}

// BUG: if the first word on the first line is longer than the width of the grid

export default VideoGrid;

// <Row className = 'grid-row'>
//     <div classname = 'img-container'>
//         <img src = {thumbnail} width = "225" height = "126" alt = "thumbnail" />
//         <div className = 'video-length'> {length} </div>
//     </div>
// </Row>
