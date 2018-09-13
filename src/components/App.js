import React, { Component } from 'react';
import './css/App.css';

import SubBox from './SubBox';
import VideoGrid from './VideoGrid';
import VideoGridGroup from './VideoGridGroup';

import gapiB from './lib/gapi-base.js';
import gapiYT from './lib/gapi-yt.js';

import {OAUTH2_CLIENT_ID} from './lib/macros.js';
import {OAUTH2_SCOPES} from './lib/macros.js';
import {YT_DISCOVERY_DOCS} from './lib/macros.js';

class App extends Component {
    state = {
        subBox: [],
        page: 'subBox',
        endOfPage: false
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

            await this.setState({subBox});

            this.checkEndOfPage();
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    updateSubBox = async () => {
        try {
            let {subBox} = this.state;

            subBox = await gapiYT.populateSubBox(subBox, subBox.length + 50);

            await this.setState({subBox});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    checkEndOfPage = async () => {
        try {
            // const app = this.refs.app;
            const app = document.documentElement;

            const scrollTop = app.scrollTop;
            const maxScrollTop = app.scrollHeight - app.clientHeight
            const per = scrollTop / maxScrollTop;

            if (maxScrollTop - scrollTop < 50) {
                await this.setState({endOfPage: true});
                await this.updateSubBox();
            }
            else {
                await this.setState({endOfPage: false});
            }

            console.log(scrollTop);

            setTimeout(this.checkEndOfPage, 1000);
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
        return (
            <div ref = 'app' className = 'App'>
                {
                    this.state.page === 'subBox' &&
                    <SubBox
                        updateSubBox = {this.updateSubBox}
                        endOfPage = {this.state.endOfPage}
                        subBox = {this.state.subBox}
                    />
                }
            </div>
        );
    }
}

export default App;
