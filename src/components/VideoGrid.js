import React, { Component } from 'react';
import './css/VideoGrid.css';

import { Grid, Row, Col, ProgressBar, Tooltip, OverlayTrigger, Glyphicon } from 'react-bootstrap';

import common from './lib/common';

class VideoGrid extends Component {
    state = {
        width: 225,
        height: 126
    };

    constructor (props) {
        super(props);
        if (this.props.width && this.props.height) {
            this.state.width = this.props.width;
            this.state.height = this.props.height;
        }
    }

    render() {
        const {width, height} = this.state;
        const widthpx = width + 'px';
        const heightpx = height + 'px'
        const {thumbnail, length, title, channelTitle, views, publishedAt, likes, dislikes, videoLink, channelLink} = this.props;

        // Styles
        const thumbnailStyle = {
            backgroundImage: 'url(' + thumbnail + ')',
            backgroundSize: "contain",
            width: widthpx,
            height: heightpx
        };

        const videoGridStyle = {
            width: widthpx
        };

        const videoLinkStyle = {
            position: 'absolute',
            display: 'block',
            width: widthpx,
            height: heightpx
        };

        // Tooltips
        const likesTooltip = (
            <Tooltip id = 'likes-tooltip'>
                {likes} <Glyphicon glyph='thumbs-up'/> {' / ' + dislikes} <Glyphicon glyph='thumbs-down'/>
            </Tooltip>
        );

        const titleTooltip = (
            <Tooltip id = 'title-tooltip'>
                {title}
            </Tooltip>
        );

        const channelTooltip = (
            <Tooltip id = 'channel-tooltip'>
                {channelTitle}
            </Tooltip>
        );

        const viewsTooltip = (
            <Tooltip id = 'view-tooltip'>
                { common.numToStr(views) }
            </Tooltip>
        );

        const publishedAtTooltip = (
            <Tooltip id = 'published-at-tooltip'>
                { (new Date(publishedAt)).toString() }
            </Tooltip>
        );

        return (
            <Grid className = 'VideoGrid' style = {videoGridStyle}>
                <Row className = 'grid-row'>
                    <OverlayTrigger id = 'likes-tooltip-overlay' placement = 'bottom' overlay = {likesTooltip} >
                        <ProgressBar className = 'like-dislike' max = {likes + dislikes} now = {likes} />
                    </OverlayTrigger>
                    <div className = 'thumbnail-container' style = {thumbnailStyle}>
                        <a href = {videoLink} style = {videoLinkStyle} />
                        <div className = 'video-length'> {length} </div>
                    </div>
                </Row>

                <Row className = 'grid-row'>
                    <OverlayTrigger id = 'title-tooltip-overlay' placement = 'top' overlay = {titleTooltip} delayShow = {1000}>
                        <a href = {videoLink} className = 'no-decoration-link-primary'> { common.trimStr(title, 50) } </a>
                    </OverlayTrigger>
                </Row>

                <Row className = 'grid-row-sec'>
                    <OverlayTrigger id = 'channel-tooltip-overlay' placement = 'top' overlay = {channelTooltip} delayShow = {1000}>
                        <a href = {channelLink} className = 'no-decoration-link-secondary'> { common.trimStr(channelTitle, 25) } </a>
                    </OverlayTrigger>
                </Row>

                <Row className = 'grid-row-sec'>
                    <OverlayTrigger id = 'views-tooltip-overlay' placement = 'right' overlay = {viewsTooltip} delayShow = {1000}>
                        <div className = 'left-col'> { common.numToShortStr(views) } </div>
                    </OverlayTrigger>

                    <OverlayTrigger id = 'published-at-tooltip-overlay' placement = 'left' overlay = {publishedAtTooltip} delayShow = {1000}>
                        <div className = 'right-col'> { common.timePassed(publishedAt) } </div>
                    </OverlayTrigger>
                </Row>
            </Grid>
        );
    }
}

// BUG: if the first word on the first line is longer than the width of the grid

export default VideoGrid;
