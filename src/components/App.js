import React, { Component } from 'react';
import './css/App.css';

// import SubBox from './SubBox';
import VideoGrid from './VideoGrid';

import common from './lib/common';
import gapiB from './lib/gapi-base.js';
import gapiYT from './lib/gapi-yt.js';

import {OAUTH2_CLIENT_ID} from './lib/macros.js';
import {OAUTH2_SCOPES} from './lib/macros.js';
import {YT_DISCOVERY_DOCS} from './lib/macros.js';

class App extends Component {
    state = {
        subBox: [],
        page: 'subBox'
    }

    componentDidMount = async () => {
        try {
            const clientComponents = [{name: 'youtube', version: 'v3'}];
            let {subBox} = this.state;

            await gapiB.load(clientComponents);

            await gapiB.authorize(OAUTH2_CLIENT_ID, OAUTH2_SCOPES, YT_DISCOVERY_DOCS);

            // Get subs only once per session
            if (!sessionStorage.getItem('subs-fetched')) {
                  await gapiYT.fetchSubs();
                  sessionStorage.setItem('subs-fetched', true);
            }

            subBox = await gapiYT.populateSubBox(subBox, 50);

            console.log(subBox);

            await this.setState({subBox});
        }
        catch (err) {
            console.log(err);
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
        // const { subs } = this.state;
        // const subList = subs.map((index, value) => (
        //     <li> {subs[value].title} </li>
        // ));
        //
        // const { subBox } = this.state;
        // const videoList = subBox.map((index, value) => (
        //     <li> {subBox[value].title} </li>
        // ));

        return (
            <div className = 'App'>
                <VideoGrid
                    thumbnail = "https://i.ytimg.com/vi/7_Prt1yjtyM/mqdefault.jpg"
                    length = '17:09'
                    title = "A NEW STAR WARS STORY | Gmod TTT"
                    channelTitle = "YOGSCAST Lewis & Simon"
                    views = "190976"
                    publishedAt = "2018-09-07T17:00:00.000Z"
                    likes = {90}
                    dislikes = {10}
                    videoLink = 'https://www.youtube.com/watch?v=7_Prt1yjtyM&t=0s'
                    channelLink = 'https://www.youtube.com/channel/UCH-_hzb2ILSCo9ftVSnrCIQ'
                />
                {
                    // this.state.page === 'subBox' &&
                    // <SubBox
                    //     subBox = {this.state.subBox}
                    // />
                }
            </div>
        );
    }
}

export default App;
