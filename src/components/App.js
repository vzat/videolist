import React, { Component } from 'react';
import './css/App.css';

import Credentials from './Credentials'

class App extends Component {
    state = {
        clientId: undefined,
        clientSecret: undefined,
        credentialsModal: false
    }

    componentDidMount = () => {
        const clientId = this.getFromLocalStorage('client_id');
        const clientSecret = this.getFromLocalStorage('client_secret');

        if (!clientId || !clientSecret) {
            // Open API Modal
            this.setState({credentialsModal: true});
        }
        else {
            this.setState({clientId: clientId});
            this.setState({clientSecret: clientSecret});
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
            <div className = 'App'>
                Hello World!

                <Credentials
                    open = {this.state.credentialsModal}
                    closeModal = {this.closeModal}
                    saveToLocalStorage = {this.saveToLocalStorage}
                />
            </div>
        );
    }
}

export default App;
