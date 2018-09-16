import React, { Component } from 'react';
import './css/VideoGrid.css';

import { Grid, Row, ProgressBar, Tooltip, OverlayTrigger, Glyphicon } from 'react-bootstrap';

import common from './lib/common';

class VideoGrid extends Component {
    state = {
        width: 225,
        height: 126,
        thumbnailDetails: true
    };

    constructor (props) {
        super(props);
        if (this.props.width && this.props.height) {
            this.state.width = this.props.width;
            this.state.height = this.props.height;
        }
    }

    hideThumbnailDetails = () => {
        // this.setState({thumbnailDetails: false});

        const thumbnailDetails = this.refs.thumbnailDetails;
        thumbnailDetails.classList.remove('showTransition');
        thumbnailDetails.classList.add('hideTransition');

        const playButton = this.refs.playButton;
        playButton.classList.remove('hideTransition');
        playButton.classList.add('showTransition');

        const thumbnailCover = this.refs.thumbnailCover;
        thumbnailCover.classList.remove('hideTransition');
        thumbnailCover.classList.add('showTransition');
    }

    showThumbnailDetails = () => {
        // this.setState({thumbnailDetails: true});

        const thumbnailDetails = this.refs.thumbnailDetails;
        thumbnailDetails.classList.remove('hideTransition');
        thumbnailDetails.classList.add('showTransition');

        const playButton = this.refs.playButton;
        playButton.classList.remove('showTransition');
        playButton.classList.add('hideTransition');

        const thumbnailCover = this.refs.thumbnailCover;
        thumbnailCover.classList.add('hideTransition');
        thumbnailCover.classList.remove('showTransition');
    }

    render() {
        const {width, height, thumbnailDetails} = this.state;
        const widthpx = width + 'px';
        const heightpx = height + 'px'
        let {thumbnail, length, title, channelTitle, views, publishedAt, likes, dislikes, videoLink, channelLink} = this.props;

        // Styles
        const thumbnailStyle = {
            backgroundImage: 'url(' + thumbnail + ')',
            backgroundSize: "contain",
            width: widthpx,
            height: heightpx
        };

        const videoGridStyle = {
            width: widthpx,
            height: widthpx,
            float: 'left',
            marginRight: '10px',
            marginBottom: '10px',

            // Fix for the page having an extra scrollbar
            overflow: 'hidden'
        };

        const videoLinkStyle = {
            position: 'absolute',
            display: 'block',
            width: widthpx,
            height: heightpx
        };

        const thumbnailCoverStyle = {
            position: 'absolute',
            display: 'block',
            width: widthpx,
            height: heightpx,

            backgroundColor: 'rgba(0, 0, 0, .5)',

            pointerEvents: 'none'
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
                        <ProgressBar className = 'like-dislike' max = {parseInt(likes) + parseInt(dislikes)} now = {likes} />
                    </OverlayTrigger>
                    <div className = 'thumbnail-container' style = {thumbnailStyle} onMouseOver = {() => this.hideThumbnailDetails()} onMouseOut = {() => this.showThumbnailDetails()}>
                        <a href = {videoLink} target='_blank' style = {videoLinkStyle} />
                        <div ref = 'thumbnailCover' className = 'hideTransition' style = {thumbnailCoverStyle}> </div>
                        <div ref = 'playButton' className = 'play-button-triangle hideTransition'> </div>
                        <div ref = 'thumbnailDetails'>
                            <div className = 'video-views'> { common.numToShortStr(views) + ' views' } </div>
                            <div className = 'video-length'> {length} </div>
                        </div>
                    </div>
                </Row>

                <Row className = 'grid-row'>
                    <OverlayTrigger id = 'title-tooltip-overlay' placement = 'top' overlay = {titleTooltip} delayShow = {1000}>
                        <a href = {videoLink} className = 'no-decoration-link-primary' target='_blank'> { common.trimStr(title, 50) } </a>
                    </OverlayTrigger>
                </Row>

                <Row className = 'grid-row-sec'>
                    <OverlayTrigger id = 'channel-tooltip-overlay' placement = 'right' overlay = {channelTooltip} delayShow = {1000}>
                        <a href = {channelLink} className = 'no-decoration-link-secondary' target='_blank'> { common.trimStr(channelTitle, 25) } </a>
                    </OverlayTrigger>
                </Row>

                <Row className = 'grid-row-sec'>
                    <OverlayTrigger id = 'published-at-tooltip-overlay' placement = 'right' overlay = {publishedAtTooltip} delayShow = {1000}>
                        <div className = 'left-col'> { common.timePassed(publishedAt) } </div>
                    </OverlayTrigger>
                </Row>
            </Grid>
        );
    }
}

// BUG: if the first word on the first line is longer than the width of the grid

export default VideoGrid;
