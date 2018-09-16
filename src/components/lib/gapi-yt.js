import common from './common.js';

let earliestPublishedAt = {}
let videosFetched = {};
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
            let videos = [];
            let videoIds = '';
            let nextPageToken = undefined;

            // All videos have been fetched
            if (earliestPublishedAt[channelId] === null) {
                return videos;
            }

            if (videosLeft[channelId] === undefined) videosLeft[channelId] = 0;
            if (videosFetched[channelId] === undefined) videosFetched[channelId] = 0;
            if (earliestPublishedAt[channelId] === undefined) earliestPublishedAt[channelId] = new Date();

            while (videos.length < 5 && nextPageToken !== null) {
                const maxResults = Math.min(videosFetched[channelId] + 5, 50);

                // Get new videos
                const videoListPart = await window.gapi.client.youtube.playlistItems.list({
                    playlistId: playlistId,
                    part: 'snippet',
                    nextPageToken,
                    maxResults
                });

                // Get the nextPageToken
                nextPageToken = videoListPart.result.nextPageToken;

                // 1. No videos have been fetched
                // 2. Videos have been fetched in the past but the total amount is under 50
                // 3. Videos have been fetched in the past and the total amount is over 50

                // Find the first video that has not been fetched before
                let videoNo;
                for (videoNo = 0 ; videoNo < videoListPart.result.items.length ; videoNo ++) {
                    const publishedAt = new Date(videoListPart.result.items[videoNo].snippet.publishedAt);

                    if (publishedAt < earliestPublishedAt[channelId]) break;
                }

                console.log(videoNo, videoListPart.result.items.length);

                // Extract videos - start from the first video not fetched before
                for (let i = videoNo ; i < videoListPart.result.items.length ; i ++) {
                    videos.push(videoListPart.result.items[i].snippet);
                    videoIds += videoListPart.result.items[i].snippet.resourceId.videoId;

                    if (i + 1 < videoListPart.result.items.length) {
                        videoIds += ',';
                    }
                    else {
                        earliestPublishedAt[channelId] = new Date(videoListPart.result.items[i].snippet.publishedAt);
                    }
                }

                // No more videos left to fetch
                if (!nextPageToken) nextPageToken = null;
            }

            // Get more data about videos if any videos have been found
            if (videoIds.length > 0) {
                // Get more data on the videos
                const videoListPartInfo = await window.gapi.client.youtube.videos.list({
                    id: videoIds,
                    part: 'contentDetails,statistics'
                });

                // console.log(videos.length, videoListPartInfo.result.items.length);

                for (let i = 0 ; i < videoListPartInfo.result.items.length ; i ++) {
                    videos[i] = {
                      ...videos[i],
                      ...videoListPartInfo.result.items[i].contentDetails,
                      ...videoListPartInfo.result.items[i].statistics
                    };
                }
            }

            // Store the number of videos left to process and the total amount of videos fetched
            videosLeft[channelId] += videos.length;
            videosFetched[channelId] += videos.length;

            // console.log(videosLeft[channelId], videosFetched[channelId]);

            return videos;
        }
        catch (err) {
            console.log(err);
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
            console.log(err);
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
            if (stagingArea.length === 0) {
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
            console.log(err);
            throw new Error(err);
        }
    }
};

export default gapiYT;
