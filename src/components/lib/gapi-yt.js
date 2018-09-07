import common from './common.js';

let nextPageTokens = {};
let videosLeft = {};
let stagingArea = [];

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

            let videoIds = '';

            // Extract videos
            for (let i = 0 ; i < videoListPart.result.items.length ; i++) {
                videos.push(videoListPart.result.items[i].snippet);
                videoIds += videoListPart.result.items[i].snippet.resourceId.videoId;

                if (i + 1 < videoListPart.result.items.length) videoIds += ',';
            }

            // Get more data on the videos
            const videoListPartInfo = await window.gapi.client.youtube.videos.list({
                id: videoIds,
                part: 'contentDetails,statistics'
            });

            for (let i = 0 ; i < videoListPart.result.items.length ; i++) {
                videos[i] = {
                  ...videos[i],
                  ...videoListPartInfo.result.items[i].contentDetails,
                  ...videos[i].statistics = videoListPartInfo.result.items[i].statistics
                };
            }

            // Store the next page token
            nextPageTokens[channelId] = videoListPart.result.nextPageToken;
            if (!nextPageTokens[channelId]) nextPageTokens[channelId] = null;

            // Store the number of videos returned
            if (!videosLeft[channelId]) videosLeft[channelId] = 0;
            videosLeft[channelId] += videos.length;

            return videos;
        }
        catch (err) {
            throw new Error(err);
        }
    },
    initStagingArea: async () => {
        try {
            let promises = [];

            const subs = await JSON.parse(localStorage.getItem('subscriptions'));

            for (let i = 0 ; i < subs.length ; i++) {
                promises.push(gapiYT.fetchLatestVideos(subs[i].resourceId.channelId));
            }

            const videos = await Promise.all(promises);

            for (const idx in videos) {
                const videoGroup = videos[idx];

                stagingArea.push(...videoGroup);
            }

            common.sortByDate(stagingArea, 'publishedAt');
        }
        catch (err) {
            throw new Error(err);
        }
    },
    updateStagingArea: async (channelId) => {
        try {
            const videos = await gapiYT.fetchLatestVideos(channelId);
            stagingArea.push(...videos);
            common.sortByDate(stagingArea, 'publishedAt');
        }
        catch (err) {
            throw new Error(err);
        }
    },
    populateSubBox: async (subBox, maxVideos) => {
        try {
            if (stagingArea.length == 0) {
                await gapiYT.initStagingArea();
            }

            let idx = subBox.length;
            while (subBox.length < maxVideos) {
                // !!! WARNING
                if (idx >= stagingArea.length) return subBox;

                const video = stagingArea[idx];

                subBox.push(video);
                videosLeft[video.channelId] --;

                // All the videos from the channel have been fetched
                // Get new ones, insert them into the stagingArea and sort it
                if (videosLeft[video.channelId] < 1) {
                    await gapiYT.updateStagingArea(video.channelId);
                }

                idx ++;
            }

            return subBox;
        }
        catch (err) {
            throw new Error(err);
        }
    }
};

export default gapiYT;
