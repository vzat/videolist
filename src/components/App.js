import React, { Component } from 'react';
import './css/App.css';

import SubBox from './SubBox';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

import gapiB from './lib/gapi-base.js';
import gapiYT from './lib/gapi-yt.js';

import {OAUTH2_CLIENT_ID} from './lib/macros.js';
import {OAUTH2_SCOPES} from './lib/macros.js';
import {YT_DISCOVERY_DOCS} from './lib/macros.js';

class App extends Component {
    state = {
        subBox: [],
        page: 'none',
        endOfPage: false,
        curPageSubs: new Set(['a']),
        loadingSubBox: true,
        initSubBox: false,
        updateSubBox: false
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
            // const per = scrollTop / maxScrollTop;

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

    setCurPageSubs = async (subs) => {
        try {
            await this.setState({curPageSubs: subs});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    setLoadingSubBox = async (loadingSubBox) => {
        try {
            await this.setState({loadingSubBox});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    triggerInitSubBox = async (initSubBox) => {
        try {
            await this.setState({initSubBox});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    triggerUpdateSubBox = async (updateSubBox) => {
        try {
            await this.setState({updateSubBox});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    render() {
        return (
            <div ref = 'app' className = 'App'>
                <TopBar
                    curPageSubs = {this.state.curPageSubs}
                    setCurPageSubs = {this.setCurPageSubs}

                    loadingSubBox = {this.state.loadingSubBox}

                    triggerInitSubBox = {this.triggerInitSubBox}
                />
                <Sidebar
                    curPageSubs = {this.state.curPageSubs}
                    setCurPageSubs = {this.setCurPageSubs}

                    loadingSubBox = {this.state.loadingSubBox}

                    triggerInitSubBox = {this.triggerInitSubBox}
                />
                {
                    this.state.page === 'subBox' &&
                    <SubBox
                        endOfPage = {this.state.endOfPage}
                        curPageSubs = {this.state.curPageSubs}

                        setLoadingSubBox = {this.setLoadingSubBox}

                        initSubBox = {this.state.initSubBox}
                        updateSubBox = {this.state.updateSubBox}

                        triggerInitSubBox = {this.triggerInitSubBox}
                    />
                }
            </div>
        );
    }
}

export default App;
