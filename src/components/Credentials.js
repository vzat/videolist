import React, { Component } from 'react';

import { Modal, Form, Button } from 'semantic-ui-react';

class Credentials extends Component {
    state = {
        clientId: '',
        clientSecret: '',
        error: false
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
    };

    saveCredentials = (event, comp) => {
        const { clientId, clientSecret } = this.state;

        // Save client id and secret to local storage
        if (clientId && clientSecret && clientId.length > 0 && clientSecret.length > 0) {
            this.props.saveToLocalStorage('client_id', clientId);
            this.props.saveToLocalStorage('client_secret', clientSecret);

            this.props.closeModal(this);
        }
    }

    render() {
        const { clientId, clientSecret } = this.state;

        this.modal = React.createRef();

        return (
            <div className = 'Credentials'>
                <Modal
                    name = 'credentialsModal'
                    ref = {this.modal}
                    open = { this.props.open }
                    closeOnEscape = { false }
                    closeOnRootNodeClick = { false }
                    size = 'fullscreen'
                    dimmer = 'blurring'
                    style = {{
                        marginTop: '30vh',
                        maxWidth: 800
                    }} >
                        <Modal.Header> API Credentials </Modal.Header>

                        <Modal.Content>
                            <Form inverted onSubmit = {this.saveCredentials} >
                                <Form.Input required fluid
                                    label = 'Client ID'
                                    placeholder = 'Client ID'
                                    name = 'clientId'
                                    value = {clientId}
                                    onChange = {this.handleChange}
                                />
                                <Form.Input required fluid
                                    label = 'Client Secret'
                                    placeholder = 'Client Secret'
                                    name = 'clientSecret'
                                    value = {clientSecret}
                                    onChange = {this.handleChange}
                                />

                                <Button primary> Save </Button>
                            </Form>
                        </Modal.Content>
                    </Modal>
            </div>
        );
    }
}

export default Credentials;
