import React, { Component } from 'react';
import './css/App.css';

import Credentials from './Credentials'

const OAUTH2_CLIENT_ID = '537371083703-tt6pkisgd198nrr04b3tb5mepdi22fep.apps.googleusercontent.com';
const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

class App extends Component {
    state = {
        clientId: undefined,
        clientSecret: undefined,
        credentialsModal: false,
        subs: []
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

            let subListPart = await window.gapi.client.youtube.subscriptions.list({
                mine: 'true',
                part: 'snippet'
            });

            if (subListPart.status !== 200) {
                throw new Error("Cannot fetch subscriptions");
            }

            let startTime = new Date().getTime() / 1000;
            let waitTime = 60;

            while (startTime + waitTime > new Date().getTime() / 1000) {
                const totalItems = subListPart.result.items.length;

                for (let i = 0 ; i < totalItems ; i++) {
                    subs.push(subListPart.result.items[i].snippet);
                }
                if (!subListPart.result.nextPageToken)  break;

                subListPart = await window.gapi.client.youtube.subscriptions.list({
                    mine: 'true',
                    part: 'snippet',
                    pageToken: subListPart.result.nextPageToken
                });
            }

            this.setState({subs: subs});
        }
        catch (err) {
            throw new Error(err);
        }
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

                this.fetchSubs();

                // const subs = await window.gapi.client.youtube.subscriptions.list({
                //     mine: 'true',
                //     part: 'snippet'
                // });

                // TODO: Save the list of subs
                // Use search for each channel id and retrieve their videos
                // Order videos based on the publishedAt time
                // Keep a list of unprocessed videos for each channel
                // Get older videos if the unprocessed list is empty
                // Do this until the page is filled? (50?)
                // Load more when the user scrolls down

                // console.log(subs);
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