import React, { Component } from 'react';
import './css/SubBox.css';

import common from './lib/common';
import gapiYT from './lib/gapi-yt.js';

import VideoGridGroup from './VideoGridGroup';

class SubBox extends Component {
    state = {
        subBox: [],
        videos: []
    }

    updateVideos = (subBox) => {
        let {videos} = this.state;

        for (let i = 0 ; i < subBox.length ; i ++) {
            const subVid = subBox[i];

            if (videos.length <= i || videos[i].videoId !== subBox[i].resourceId.videoId) {
                let video = {};

                video.videoId = subVid.resourceId.videoId;
                video.thumbnail = subVid.thumbnails.medium.url ? subVid.thumbnails.medium.url : subVid.thumbnails.default.url;
                video.length = common.durationToString(common.durationToSec(subVid.duration));
                video.title = subVid.title;
                video.channelTitle = subVid.channelTitle;
                video.views = subVid.viewCount;
                video.publishedAt = subVid.publishedAt;
                video.likes = subVid.likeCount;
                video.dislikes = subVid.dislikeCount;
                video.videoLink = 'https://www.youtube.com/watch?v=' + subVid.resourceId.videoId;
                video.channelLink = 'https://www.youtube.com/channel/' + subVid.channelId;

                videos.push(video);
            }
        }

        this.setState({videos});
    }

    updateSubBox = async () => {
        try {
            let {subBox} = this.state;

            subBox = await gapiYT.populateSubBox(subBox, subBox.length + 50);

            this.updateVideos(subBox);

            await this.setState({subBox});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    componentDidMount = async () => {
        try {
            let {subBox} = this.state;

            subBox = await gapiYT.populateSubBox(subBox, 50);

            await this.setState({subBox});

            this.updateVideos(subBox);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    componentWillReceiveProps = async (nextProps) => {
        try {
            if (nextProps.endOfPage === true) {
                await this.updateSubBox();
            }
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    render() {
        return (
            <div ref = 'subBox' className = 'SubBox'>
                <VideoGridGroup
                    videos = {this.state.videos}
                />
                <div className = 'page-end-loading'> Loading... </div>
            </div>
        );
    }
}

export default SubBox;
