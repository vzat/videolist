import React, { Component } from 'react';
import './css/TopBar.css';

import { DropdownButton, MenuItem } from 'react-bootstrap';

class TopBar extends Component {
    state = {
    }

    componentDidMount = () => {
    }

    render() {
        return (
            <div className = 'TopBar' >
                <DropdownButton className = 'video-lists' title = 'Main'>
                    <MenuItem className = 'video-list' eventKey = '1'> First </MenuItem>
                    <MenuItem className = 'video-list' eventKey = '2'> Second </MenuItem>
                    <MenuItem className = 'video-list' eventKey = '3'> Third </MenuItem>
                </DropdownButton>
            </div>
        );
    }
}

export default TopBar;
