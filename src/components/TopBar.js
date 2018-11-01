import React, { Component } from 'react';
import './css/TopBar.css';

import { DropdownButton, MenuItem, Glyphicon } from 'react-bootstrap';

class TopBar extends Component {
    state = {
        videoLists: {},
        currentList: 'All'
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
        const { videoLists } = this.state;

        const lists = Object.keys(videoLists).map((list, idx) => (
            <MenuItem className = 'video-list' eventKey = {idx}> {list} </MenuItem>
        ));

        return (
            <div className = 'TopBar' >
                <div className = 'logo'> Video List </div>

                <div className = 'content'>
                    <DropdownButton className = 'video-lists' title = {this.state.currentList}>
                        {lists}
                        <MenuItem className = 'video-list' eventKey = 'new'>
                            <Glyphicon glyph='plus'/> New List
                        </MenuItem>
                    </DropdownButton>
                </div>
            </div>
        );
    }
}

export default TopBar;
