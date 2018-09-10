import React, { Component } from 'react';
import './css/VideoGridGroup.css';

import { Grid, Row } from 'react-bootstrap';

import VideoGrid from './VideoGrid';

class VideoGridGroup extends Component {
    render() {
        const {videos} = this.props;
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
            />
        ));

        return (
            <div className = 'VideoGridGroup'>
                {videoGrid}
            </div>
        );
    }
}

export default VideoGridGroup;
