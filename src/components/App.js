import React, { Component } from 'react';
import './css/App.css';

import Credentials from './Credentials'

const OAUTH2_CLIENT_ID = '537371083703-tt6pkisgd198nrr04b3tb5mepdi22fep.apps.googleusercontent.com';
const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

class App extends Component {
    state = {
        clientId: undefined,
        clientSecret: undefined,
        credentialsModal: false
    }

    loadApi = async (script) => {

        if (script.getAttribute('gapi_processed')) {
            try {
                const response = await window.gapi.auth.authorize({
                    client_id: OAUTH2_CLIENT_ID,
                    scope: OAUTH2_SCOPES,
                    immediate: false
                });

                console.log(response);
            }
            catch (err) {
                throw new Error(JSON.stringify(err));
            }
        }
        else {
            setTimeout(() => {this.loadApi(script)}, 100);
        }

    }

    componentDidMount = () => {
        const script = document.createElement('script');
        script.src = 'https://apis.google.com/js/client.js';

        script.onload = () => {
            this.loadApi(script);
        };

        document.body.appendChild(script);
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
            <div className = 'App'>
                Hello World!
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
