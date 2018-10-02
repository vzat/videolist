import React, { Component } from 'react';
import './css/VideoGrid.css';

import { Grid, Row, ProgressBar, Tooltip, OverlayTrigger, Glyphicon } from 'react-bootstrap';

import common from './lib/common';

class VideoGrid extends Component {
    state = {
        width: 225,
        height: 126,
        thumbnailDetails: true,
        showPreview: false,
        curPreview: 0,
        lineHeight: 10
    };

    constructor (props) {
        super(props);
        if (this.props.width && this.props.height) {
            this.state.width = this.props.width;
            this.state.height = this.props.height;
        }

        this.changePreviewImage();
    }

    componentDidMount = () => {
        const a = this.refs.videoTitle;
        const compStyle = window.getComputedStyle(a);
        const lineHeight = parseFloat(compStyle.getPropertyValue('line-height'), 10);
        this.setState({lineHeight});
    }

    hideThumbnailDetails = () => {
        const thumbnailDetails = this.refs.thumbnailDetails;
        thumbnailDetails.classList.remove('showTransition');
        thumbnailDetails.classList.add('hideTransition');

        if (this.props.previewThumbnails.length === 0) {
            const playButton = this.refs.playButton;
            playButton.classList.remove('hideTransition');
            playButton.classList.add('showTransition');

            const thumbnailCover = this.refs.thumbnailCover;
            thumbnailCover.classList.remove('hideTransition');
            thumbnailCover.classList.add('showTransition');
        }
        else {
            this.setState({showPreview: true});
        }
    }

    showThumbnailDetails = () => {
        const thumbnailDetails = this.refs.thumbnailDetails;
        thumbnailDetails.classList.remove('hideTransition');
        thumbnailDetails.classList.add('showTransition');

        if (this.props.previewThumbnails.length === 0) {
            const playButton = this.refs.playButton;
            playButton.classList.remove('showTransition');
            playButton.classList.add('hideTransition');

            const thumbnailCover = this.refs.thumbnailCover;
            thumbnailCover.classList.add('hideTransition');
            thumbnailCover.classList.remove('showTransition');
        }
        else {
            this.setState({showPreview: false});
        }
    }

    changePreviewImage = async () => {
        try {
            if (this.state.showPreview) {
                let thumbnailCover = this.refs.thumbnailCover;
                thumbnailCover.classList.remove('changePreviewEnd');
                thumbnailCover.classList.add('changePreviewStart');

                await new Promise(resolve => { setTimeout(resolve, 200) });

                const nextPreview = (this.state.curPreview + 1) % this.props.previewThumbnails.length;
                await this.setState({curPreview: nextPreview})

                thumbnailCover.classList.add('changePreviewEnd');
                thumbnailCover.classList.remove('changePreviewStart');

                await new Promise(resolve => { setTimeout(resolve, 200) });
            }
            else if (this.state.curPreview !== 0) {
                await this.setState({curPreview: 0});
            }

            setTimeout(this.changePreviewImage, 600);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    render() {
        const {width, height, lineHeight} = this.state;
        const widthpx = width + 'px';
        const heightpx = height + 'px';
        const titleHeightpx = (lineHeight * 2) + 'px';
        let {thumbnail, length, title, channelTitle, views, publishedAt, likes, dislikes, videoLink, channelLink} = this.props;
        let thumb = this.state.showPreview ? this.props.previewThumbnails[this.state.curPreview] : thumbnail;

        // Styles
        const thumbnailStyle = {
            backgroundImage: 'url(' + thumb + ')',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            width: widthpx,
            height: heightpx
        };

        const videoGridStyle = {
            width: widthpx,

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

        const videoTitleStyle = {
            display: 'block',
            height: titleHeightpx,
            overflow: 'hidden'
        }

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

        const publishedAtTooltip = (
            <Tooltip id = 'published-at-tooltip'>
                { (new Date(publishedAt)).toString() }
            </Tooltip>
        );

        return (
            <Grid className = 'VideoGrid' style = {videoGridStyle}>
                <Row className = 'grid-row'>
                    <OverlayTrigger id = 'likes-tooltip-overlay' placement = 'top' overlay = {likesTooltip} >
                        <ProgressBar className = 'like-dislike' max = {parseInt(likes, 10) + parseInt(dislikes, 10)} now = {likes} />
                    </OverlayTrigger>
                    <div className = 'thumbnail-container' style = {thumbnailStyle} onMouseOver = {() => this.hideThumbnailDetails()} onMouseOut = {() => this.showThumbnailDetails()}>
                        <a href = {videoLink} target='_blank' style = {videoLinkStyle} > </a>
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
                        <a ref = 'videoTitle' href = {videoLink} className = 'no-decoration-link-primary' style = {videoTitleStyle} target='_blank'> { title } </a>
                    </OverlayTrigger>
                </Row>

                <Row className = 'grid-row-sec'>

                    <OverlayTrigger id = 'channel-tooltip-overlay' placement = 'right' overlay = {channelTooltip} delayShow = {1000}>
                        <a href = {channelLink} className = 'no-decoration-link-secondary' target='_blank'>
                            <Glyphicon glyph = 'user' /> { common.trimStr(channelTitle, 25) }
                        </a>
                    </OverlayTrigger>
                </Row>

                <Row className = 'grid-row-sec'>
                    <OverlayTrigger id = 'published-at-tooltip-overlay' placement = 'right' overlay = {publishedAtTooltip} delayShow = {1000}>
                        <div className = 'left-col'>
                            <Glyphicon glyph = 'time' /> { common.timePassed(publishedAt) }
                        </div>
                    </OverlayTrigger>
                </Row>
            </Grid>
        );
    }
}

// BUG: if the first word on the first line is longer than the width of the grid

export default VideoGrid;
