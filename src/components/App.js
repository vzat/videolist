import React, { Component } from 'react';
import './css/App.css';

const OAUTH2_CLIENT_ID = '537371083703-tt6pkisgd198nrr04b3tb5mepdi22fep.apps.googleusercontent.com';
const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

class App extends Component {
    state = {
        clientId: undefined,
        clientSecret: undefined,
        credentialsModal: false,
        subs: [],
        stagingArea: {},
        subBox: [{
            title: 'dsada',
            thumbnail: 'url'
        }],
        subInfo: []
    }

    loadApi = async (script) => {
        try {
            while (!script.getAttribute('gapi_processed')) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
            await window.gapi.client.load('youtube', 'v3');
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    authoriseApi = async () => {
        try {
            const response = await window.gapi.auth.authorize({
                client_id: OAUTH2_CLIENT_ID,
                scope: OAUTH2_SCOPES,
                immediate: false
            });

            if (response && !response.error) {
                this.saveToLocalStorage('access_token', response.access_token);
                this.saveToLocalStorage('expires_at', response.expires_at);
            }
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    fetchSubs = async () => {
        try {
            let subs = [];
            // let uploadPlaylists = {};

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
                // let subList = [];
                const totalItems = subListPart.result.items.length;

                // List of subs on the page for getting some extra channel details (uploads playlist)
                // let pageSubs = '';

                // Get subs names
                for (let i = 0 ; i < totalItems ; i++) {
                    // subList.push(subListPart.result.items[i].snippet);
                    subs.push(subListPart.result.items[i].snippet);
                    // pageSubs += subListPart.result.items[i].snippet.resourceId.channelId;
                    //
                    // if (i < totalItems - 1) {
                    //     pageSubs += ',';
                    // }
                }

                // !!! The upload playlist id is the same as the channel id except is starts with UU instead of UC

                // // Get new page with channel related playlists
                // let channelListPart = await window.gapi.client.youtube.channels.list({
                //       id: pageSubs,
                //       part: 'contentDetails'
                // });
                //
                // // Add the sub details to the subs list
                // for (let channelIndex = 0 ; channelIndex < channelListPart.result.items.length ; channelIndex++) {
                //
                //     uploadPlaylists[channelListPart.result.items[channelIndex].id] = channelListPart.result.items[channelIndex].contentDetails.relatedPlaylists.uploads;
                // }

                // console.log(uploadPlaylists);

                // Reached end of subs
                if (!subListPart.result.nextPageToken)  break;

                // Save the subs
                this.setState({subs: subs});

                // Get new page with subscriptions
                subListPart = await window.gapi.client.youtube.subscriptions.list({
                    mine: 'true',
                    part: 'snippet',
                    pageToken: subListPart.result.nextPageToken,
                    maxResults: 50
                });
            }

            // Create hashed array with channel details
            let subInfo = {};
            for (let i = 0 ; i < subs.length ; i++) {
                subInfo[subs[i].channelId] = subs[i];
            }

            this.setState({subs});
            this.setState({subInfo});
            // this.setState({uploadPlaylists})
        }
        catch (err) {
            throw new Error(err);
        }
    }

    fetchLatestVideos = async (channelId) => {
        try {
            const { stagingArea } = this.state;

            const playlistId = channelId[0] + 'U' + channelId.substring(2);

            let nextPageToken = null;
            if (stagingArea[channelId]) {
                nextPageToken = stagingArea[channelId].nextPageToken;

                // Delete sub if the last page was reached
                if (!nextPageToken) {
                    delete stagingArea[channelId];
                    return;
                }
            }

            // Get new videos
            const videoListPart = await window.gapi.client.youtube.playlistItems.list({
                playlistId: playlistId,
                part: 'snippet',
                nextPageToken: nextPageToken
            });

            // Extract videos
            let videos = [];
            for (let i = 0 ; i < videoListPart.result.items.length ; i++) {
                videos.push(videoListPart.result.items[i].snippet);
            }

            if (videos.length === 0) {
                delete stagingArea[channelId];
                return;
            }

            // Sort by published date
            this.sortByDate(videos, 'publishedAt');

            // Save videos
            const sub = {
                videos: videos.slice(),
                lastPublishedVideo: videos[0].publishedAt,
                nextPageToken: videoListPart.result.nextPageToken
            }
            stagingArea[channelId] = sub;

            await this.setState({stagingArea});
        }
        catch (err) {
            throw new Error(err);
        }
    }

    initStagingArea = async () => {
        try {
            const { subs } = this.state;

            for (let i = 0 ; i < subs.length ; i++) {
                await this.fetchLatestVideos(subs[i].resourceId.channelId);
            }

            console.log(this.state.stagingArea);
        }
        catch (err) {
            throw new Error(err);
        }
    }

    sortByDate = (array, key) => {
        array.sort((a, b) => {
            return new Date(b[key]) - new Date(a[key]);
        })
    }

    componentDidMount = async () => {
        try {
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/client.js';

            script.onload = async () => {
                let accessToken = this.getFromLocalStorage('access_token');
                let expiresAt = this.getFromLocalStorage('expires_at');

                // Wait for script to load
                // Load the youtube component
                await this.loadApi(script);

                if (!accessToken || !expiresAt || expiresAt <= new Date().getTime() / 1000 - 10) {
                    await this.authoriseApi();

                    // Get new token
                    accessToken = this.getFromLocalStorage('access_token');
                }

                // Set the access token for the requests
                window.gapi.client.setToken({access_token: accessToken});

                await this.fetchSubs();

                // this.fetchLatestVideos('UC7A_dLnSAjl7uROCdoNyjzg');
                this.initStagingArea();

                // TODO: Save the list of subs
                // Use search for each channel id and retrieve their videos
                // Order videos based on the publishedAt time
                // Keep a list of unprocessed videos for each channel
                // Get older videos if the unprocessed list is empty
                // Do this until the page is filled? (50?)
                // Load more when the user scrolls down
            };

            document.body.appendChild(script);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    saveToLocalStorage = (key, value) => {
        localStorage.setItem(key, value);
    }

    getFromLocalStorage = (key) => {
        return localStorage.getItem(key);
    }

    closeModal = (comp) => {
        if (comp.modal) {
            const modalName = comp.modal.current.props.name;
            this.setState({[modalName]: false});
        }
        else {
            throw new Error('No Modal Found');
        }
    }

    render() {
        const { subs } = this.state;
        const subList = subs.map((index, value) => (
            <li> {subs[value].title} </li>
        ));

        return (
            <div className = 'App'>
                Subscriptions: { subs.length }
                <br/>
                <ul> { subList } </ul>
            </div>
        );
    }
}

export default App;

// <Credentials
//     open = {this.state.credentialsModal}
//     closeModal = {this.closeModal}
//     saveToLocalStorage = {this.saveToLocalStorage}
// />
