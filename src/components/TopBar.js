import React, { Component } from 'react';
import './css/TopBar.css';

import { DropdownButton, MenuItem } from 'react-bootstrap';

class TopBar extends Component {
    state = {
        videoLists: {}
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

    render() {
        return (
            <div className = 'TopBar' >
                <div className = 'logo'> Video List </div>

                <div className = 'content'>
                    <DropdownButton className = 'video-lists' title = 'Main'>
                        <MenuItem className = 'video-list' eventKey = '1'> First </MenuItem>
                        <MenuItem className = 'video-list' eventKey = '2'> Second </MenuItem>
                        <MenuItem className = 'video-list' eventKey = '3'> Third </MenuItem>
                    </DropdownButton>
                </div>
            </div>
        );
    }
}

export default TopBar;
