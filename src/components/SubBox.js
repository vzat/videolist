import React, { Component } from 'react';
import './css/SubBox.css';

import common from './lib/common';

import VideoGridGroup from './VideoGridGroup';

class SubBox extends Component {
    state = {
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

    componentDidMount = () => {
        this.updateVideos(this.props.subBox);
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.subBox.length >= this.props.subBox.length) {
              this.updateVideos(nextProps.subBox);
        }
    }

    render() {
        return (
            <div ref = 'subbox' className = 'SubBox'>
                <VideoGridGroup
                    videos = {this.state.videos}
                />
                <div className = 'page-end-loading'> Loading... </div>
            </div>
        );
    }
}

export default SubBox;
