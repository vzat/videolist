import React, { Component } from 'react';
import './css/VideoGridGroup.css';

import { Grid, Row } from 'react-bootstrap';

import VideoGrid from './VideoGrid';

class VideoGridGroup extends Component {
    state = {
        thumbnailWidth: 225,
        thumbnailHeight: 126,
        padding: 10
    }

    constructor (props) {
        super (props);

        // Calculate padding - WIP
        // const pageWidth = document.documentElement.clientWidth - 17;
        // const thumbWithSep = this.state.thumbnailWidth + 10;
        //
        // const thumbsPerPage = Math.floor(pageWidth / thumbWithSep);
        //
        // let spaceWithThumbs = thumbsPerPage * thumbWithSep;
        // if (spaceWithThumbs + this.state.thumbnailWidth < pageWidth) {
        //     spaceWithThumbs += this.state.thumbnailWidth
        // }
        //
        // this.state.padding = Math.floor((pageWidth - spaceWithThumbs) / 2);
    }

    componentDidMount = () => {
        this.checkWindowSize();
    }

    checkWindowSize = async (prevClientWidth) => {
        try {
            const {videoGridGroup} = this.refs;

            if (videoGridGroup.clientWidth !== prevClientWidth) {
                const padding = this.getPagePadding(videoGridGroup.clientWidth);

                await this.setState({padding});
            }

            setTimeout(this.checkWindowSize.bind(null, videoGridGroup.clientWidth), 250);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    getPagePadding = (clientWidth) => {
        const pageWidth = clientWidth;
        const thumbWithSep = this.state.thumbnailWidth + 10;

        const thumbsPerPage = Math.floor(pageWidth / thumbWithSep);

        let spaceWithThumbs = thumbsPerPage * thumbWithSep;
        if (spaceWithThumbs + this.state.thumbnailWidth < pageWidth) {
            spaceWithThumbs += this.state.thumbnailWidth
        }

        return Math.floor((pageWidth - spaceWithThumbs) / 2);
    }

    render() {
        const {videos} = this.props;
        const {padding} = this.state;

        const videoGrid = videos.map((video, idx) => (
            <VideoGrid
                thumbnail = {video.thumbnail}
                length = {video.length}
                title = {video.title}
                channelTitle = {video.channelTitle}
                views = {video.views}
                publishedAt = {video.publishedAt}
                likes = {video.likes}
                dislikes = {video.dislikes}
                videoLink = {video.videoLink}
                channelLink = {video.channelLink}

                width = {this.state.thumbnailWidth}
                height = {this.state.thumbnailHeight}
            />
        ));

        const videoGridGroupStyle = {
            paddingTop: '10px',
            paddingLeft: padding + 'px'
        };

        return (
            <div ref = 'videoGridGroup' className = 'VideoGridGroup' style = {videoGridGroupStyle}>
                {videoGrid}
            </div>
        );
    }
}

export default VideoGridGroup;
