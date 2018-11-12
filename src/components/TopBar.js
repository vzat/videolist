import React, { Component } from 'react';
import './css/TopBar.css';

import { DropdownButton, MenuItem, Glyphicon, Modal, Button, Alert } from 'react-bootstrap';

class TopBar extends Component {
    state = {
        videoLists: {},
        currentList: 'All',
        newListModalOpened: false,
        newVideoListName: '',
        showVideoListNameAlert: false,
        loadingSubBox: true
    }

    componentDidMount = () => {
        this.getVideoLists();
    }

    getVideoLists = async () => {
        try {
            if (!sessionStorage.getItem('subs-fetched')) {
                setTimeout(this.getVideoLists, 1000);
                return;
            }

            // const subs = await JSON.parse(localStorage.getItem('subscriptions'));
            // let subIds = new Set();
            // for (const idx in subs) {
            //     console.log(subs[idx]);
            //     subIds.add(subs[idx].resourceId.channelId);
            // }

            const subs = await JSON.parse(localStorage.getItem('subscriptions'));
            let subIds = [];
            for (const idx in subs) {
                subIds.push(subs[idx].resourceId.channelId);
            }

            let videoLists = {
                'All': subIds
            };

            // let videoLists = {
            //     'All': await JSON.parse(sessionStorage.getItem('subs-fetched'))
            // };

            if (localStorage.getItem('video-lists')) {
                let storedVideoLists = await JSON.parse(localStorage.getItem('video-lists'));

                videoLists = {
                    ...storedVideoLists,
                    ...videoLists
                };
            }

            localStorage.setItem('video-lists', JSON.stringify(videoLists));

            // FIX: Old local storage data is deleted

            await this.setState({videoLists});
            await this.props.setCurPageSubs(new Set(videoLists['All']));
        }
        catch (err) {
            console.log(err);
            throw new Error(JSON.stringify(err));
        }
    }

    componentWillReceiveProps = async (nextProps) => {
        try {
            if (nextProps.curPageSubs.size !== this.state.videoLists[this.state.currentList].size) {
                let { videoLists } = this.state;
                videoLists[this.state.currentList] = [...nextProps.curPageSubs];
                localStorage.setItem('video-lists', JSON.stringify(videoLists));
            }

            if (nextProps.loadingSubBox !== this.state.loadingSubBox) {
                await this.setState({loadingSubBox: nextProps.loadingSubBox});
            }
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
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

    onListSelect = async (eventKey) => {
        try {
            // Add new list
            if (eventKey === 'addNewList') {
                this.showNewListModal();
            }
            else if (this.state.videoLists[eventKey]) {
                await this.setState({currentList: eventKey});
                await this.props.setCurPageSubs(new Set(this.state.videoLists[eventKey]));
            }
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
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
                    <DropdownButton className = 'video-lists' title = {this.state.currentList} onSelect = {this.onListSelect} disabled = {this.state.loadingSubBox}>
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
