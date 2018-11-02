import React, { Component } from 'react';
import './css/TopBar.css';

import { DropdownButton, MenuItem, Glyphicon, Modal, Button, Alert } from 'react-bootstrap';

class TopBar extends Component {
    state = {
        videoLists: {},
        currentList: 'All',
        newListModalOpened: false,
        newVideoListName: '',
        showVideoListNameAlert: false
    }

    componentDidMount = () => {
        this.getVideoLists();
    }

    getVideoLists = async () => {
        if (!sessionStorage.getItem('subs-fetched')) {
            setTimeout(this.getVideoLists, 1000);
            return;
        }

        let videoLists = {
            'All': await JSON.parse(sessionStorage.getItem('subs-fetched'))
        };

        if (localStorage.getItem('video-lists')) {
            let storedVideoLists = await JSON.parse(localStorage.getItem('video-lists'));

            videoLists = {
                ...videoLists,
                ...storedVideoLists
            };
        }

        await this.setState({videoLists});
    }

    showNewListModal = () => {
        this.setState({newListModalOpened: true});
    }

    hideNewListModal = () => {
        this.setState({newListModalOpened: false});

        // Close warning
        if (this.state.showVideoListNameAlert) {
            this.setState({showVideoListNameAlert: false});
        }

        // Clean Input
        this.setState({newVideoListName: ''});
    }

    onListSelect = (eventKey) => {
        // Add new list
        if (eventKey === 'addNewList') {
            this.showNewListModal();
        }
        else if (this.state.videoLists[eventKey]) {
            this.setState({currentList: eventKey});
        }
    }

    handleListNameChange = (event, comp) => {
        this.setState({newVideoListName: event.target.value});
    }

    handleNewList = () => {
        const { videoLists } = this.state;

        if (!videoLists[this.state.newVideoListName]) {
            videoLists[this.state.newVideoListName] = [];

            // Create the new list
            this.setState({videoLists});
            localStorage.setItem('video-lists', JSON.stringify(videoLists));

            // CloseModal
            this.hideNewListModal();

        }
        else {
            // Display error
            this.setState({showVideoListNameAlert: true});
        }
    }

    render() {
        const { videoLists } = this.state;

        const lists = Object.keys(videoLists).map((list, idx) => (
            <MenuItem className = 'video-list' eventKey = {list}> {list} </MenuItem>
        ));

        return (
            <div className = 'TopBar' >
                <div className = 'logo'> Video List </div>

                <div className = 'content'>
                    <DropdownButton className = 'video-lists' title = {this.state.currentList} onSelect = {this.onListSelect} >
                        {lists}
                        <MenuItem divider />
                        <MenuItem className = 'video-list' eventKey = 'addNewList'>
                            <Glyphicon glyph='plus'/> New List
                        </MenuItem>
                    </DropdownButton>
                </div>

                <Modal show = {this.state.newListModalOpened} onHide = {this.hideNewListModal}>
                    <Modal.Header>
                        <Modal.Title> Add a new Video List </Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <input
                            id = 'add-video-list'
                            name = 'add-video-list'
                            className = 'video-list-input'
                            placeholder = 'List name'
                            value = {this.state.newVideoListName}
                            onChange = {this.handleListNameChange} />

                        <Button
                            className = 'video-list-submit'
                            onClick = {this.handleNewList} >
                                Submit
                        </Button>

                        { this.state.showVideoListNameAlert &&
                            <Alert bsStyle = 'warning'>
                                A list with this name already exists.
                            </Alert>
                        }

                    </Modal.Body>
                </Modal>
            </div>
        );
    }
}

export default TopBar;
