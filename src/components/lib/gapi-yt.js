import common from './common.js';

let subs;
let stagingArea;
let subBox;

let nextPageTokens = {};

const gapiYT = {
    fetchSubs: async () => {
        try {
            let subs = [];

            let subListPart = await window.gapi.client.youtube.subscriptions.list({
                mine: 'true',
                part: 'snippet',
                maxResults: 50
            });

            if (subListPart.status !== 200) {
                throw new Error("Cannot fetch subscriptions");
            }

            let startTime = new Date().getTime() / 1000;
            let waitTime = 60;

            while (startTime + waitTime > new Date().getTime() / 1000) {
                const totalItems = subListPart.result.items.length;

                // Get subs names
                for (let i = 0 ; i < totalItems ; i++) {
                    subs.push(subListPart.result.items[i].snippet);
                }

                // Reached end of subs
                if (!subListPart.result.nextPageToken)  break;

                // Get new page with subscriptions
                subListPart = await window.gapi.client.youtube.subscriptions.list({
                    mine: 'true',
                    part: 'snippet',
                    pageToken: subListPart.result.nextPageToken,
                    maxResults: 50
                });
            }

            localStorage.setItem('subscriptions', JSON.stringify(subs));
        }
        catch (err) {
            throw new Error(err);
        }
    },
    fetchLatestVideos: async (channelId) => {
        try {
            const playlistId = channelId[0] + 'U' + channelId.substring(2);
            const nextPageToken = nextPageTokens[channelId];
            let videos = [];

            // All videos have been fetched
            if (nextPageToken === null) {
                return videos;
            }

            // Get new videos
            const videoListPart = await window.gapi.client.youtube.playlistItems.list({
                playlistId: playlistId,
                part: 'snippet',
                nextPageToken: nextPageToken
            });

            // Extract videos
            for (let i = 0 ; i < videoListPart.result.items.length ; i++) {
                videos.push(videoListPart.result.items[i].snippet);
            }

            // Store the next page token
            nextPageTokens[channelId] = videoListPart.result.nextPageToken;
            if (!nextPageTokens[channelId]) nextPageTokens[channelId] = null;

            return videos;
        }
        catch (err) {
            throw new Error(err);
        }
    },
    initStagingArea: async (subs, stagingArea) => {
        try {
            let promises = [];

            for (let i = 0 ; i < subs.length ; i++) {
                promises.push(this.fetchLatestVideos(subs[i].resourceId.channelId, stagingArea));
            }

            await Promise.all(promises);
        }
        catch (err) {
            throw new Error(err);
        }
    },
    populateSubBox: async (subBox, stagingArea) => {
        let maxVideos = 50;

        while (subBox.length < maxVideos) {
            let channelIds = Object.keys(stagingArea);

            let lastPublishedVideo = new Date(0);
            let lastPublisher;

            // Get latest video
            for (let channelNo = 0 ; channelNo < channelIds.length ; channelNo ++) {
                const channelId = channelIds[channelNo];

                const channel = stagingArea[channelId];

                if (new Date(channel.lastPublishedVideo) > new Date(lastPublishedVideo)) {
                    lastPublishedVideo = channel.lastPublishedVideo;
                    lastPublisher = channelId;
                }
            }

            if (!lastPublisher) {
                break;
            }

            let channel = stagingArea[lastPublisher];

            // Store the latest video
            subBox.push({
                title: channel.videos[0].title,
                channel: this.state.subInfo[lastPublisher].title,
                publishedAt: channel.videos[0].publishedAt,
                thumbnail: channel.videos[0].thumbnails.standard,
                url: 'https://www.youtube.com/watch?v=' + channel.videos[0].resourceId.videoId
            });

            // Remove latest video
            channel.videos.splice(0, 1);

            // Get new videos from the channel if the stored ones have been used
            if (channel.videos.length === 0) {
                await this.fetchLatestVideos(lastPublisher, stagingArea);
                stagingArea = this.state.stagingArea;
                channel = stagingArea[lastPublisher];
            }
            else {
                channel.lastPublishedVideo = channel.videos[0].publishedAt;
                stagingArea[lastPublisher] = channel;
            }
        }
    }
};

export default gapiYT;
