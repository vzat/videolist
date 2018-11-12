import React, { Component } from 'react';
import './css/SubBox.css';

import common from './lib/common';
import gapiYT from './lib/gapi-yt.js';

import VideoGridGroup from './VideoGridGroup';

class SubBox extends Component {
    state = {
        subBox: [],
        videos: [],
        channelList: new Set(),
        triggerInit: false,
        triggerUpdate: false
    }

    updateVideos = async (subBox) => {
        try {
            let {videos} = this.state;

            for (let i = 0 ; i < subBox.length ; i ++) {
                const subVid = subBox[i];

                if (videos.length <= i || videos[i].videoId !== subBox[i].resourceId.videoId) {
                    let video = {};

                    video.videoId = subVid.resourceId.videoId;
                    video.thumbnail = subVid.thumbnails.medium.url ? subVid.thumbnails.medium.url : subVid.thumbnails.default.url;
                    video.previewThumbnails = [ 'https://img.youtube.com/vi/'+ subVid.resourceId.videoId + '/1.jpg',
                                                'https://img.youtube.com/vi/'+ subVid.resourceId.videoId + '/2.jpg',
                                                'https://img.youtube.com/vi/'+ subVid.resourceId.videoId + '/3.jpg'];
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

            await this.setState({videos});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    updateSubBox = async () => {
        try {
            if (this.state.triggerUpdate) {
                await this.props.setLoadingSubBox(true);

                let {subBox} = this.state;

                subBox = await gapiYT.populateSubBox(subBox, subBox.length + 20, this.state.channelList);

                await this.updateVideos(subBox);

                await this.setState({subBox});

                await this.setState({triggerUpdate: false});

                await this.props.setLoadingSubBox(false);
            }

            setTimeout(this.updateSubBox, 100);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    initSubBox = async () => {
        try {
            if (this.state.triggerInit) {
                await this.props.setLoadingSubBox(true);

                let subBox = [];

                await this.setState({videos: []});

                subBox = await gapiYT.populateSubBox(subBox, 28, this.state.channelList);

                await this.setState({subBox});

                await this.updateVideos(subBox);

                await this.setState({triggerInit: false});

                await this.props.setLoadingSubBox(false);
            }

            setTimeout(this.initSubBox, 100);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    componentDidMount = async () => {
        try {
            // await this.setState({channelList: new Set(this.props.curPageSubs)});
            await this.setState({channelList: this.props.curPageSubs});
            // await this.initSubBox();
            await this.setState({triggerInit: true});

            this.initSubBox();
            this.updateSubBox();
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    componentWillReceiveProps = async (nextProps) => {
        try {
            if (!common.eqSets(this.state.channelList, nextProps.curPageSubs)) {
                // Reload subs
                await this.setState({channelList: nextProps.curPageSubs});
                // await this.setState({channelList: new Set(nextProps.curPageSubs)});
                // await this.initSubBox();

                if (!this.state.triggerInit) {
                    await this.setState({triggerInit: true});
                }
            }
            else if (nextProps.endOfPage === true) {
                // await this.updateSubBox();

                if (!this.state.triggerInit && !this.state.triggerUpdate) {
                    await this.setState({triggerUpdate: true});
                }
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
