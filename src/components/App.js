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
        page: 'none',
        endOfPage: false
    }

    componentDidMount = async () => {
        try {
            const clientComponents = [{name: 'youtube', version: 'v3'}];
            // let {subBox} = this.state;

            await gapiB.load(clientComponents);

            await gapiB.authorize(OAUTH2_CLIENT_ID, OAUTH2_SCOPES, YT_DISCOVERY_DOCS);

            // Get subs only once per session
            if (!sessionStorage.getItem('subs-fetched')) {
                  await gapiYT.fetchSubs();
                  sessionStorage.setItem('subs-fetched', true);
            }

            await this.setState({page: 'subBox'});

            this.checkEndOfPage();
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

            let endOfPage = maxScrollTop - scrollTop < 50 ? true : false;

            if (this.state.endOfPage !== endOfPage) {
                await this.setState({endOfPage});
            }

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
                        endOfPage = {this.state.endOfPage}
                    />
                }
            </div>
        );
    }
}

export default App;
