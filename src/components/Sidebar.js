import React, { Component } from 'react';
import './css/Sidebar.css';

import { Button, Glyphicon } from 'react-bootstrap';

class Sidebar extends Component {
    state = {
        subs: [],
        hover: false,
        loadingSubBox: false
    }

    componentDidMount = () => {
        this.getSubs();
    }

    getSubs = async () => {
        try {
            if (!sessionStorage.getItem('subs-fetched')) {
                setTimeout(this.getSubs, 1000);
                return;
            }

            const subs = await JSON.parse(localStorage.getItem('subscriptions'));

            await this.setState({subs});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    addToList = async (event) => {
        try {
            const channelId = event.target.id;
            let { curPageSubs } = this.props;
            curPageSubs.add(channelId);
            await this.props.setCurPageSubs(curPageSubs);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    removeFromList = async (event) => {
        try {
            const channelId = event.target.id;
            let { curPageSubs } = this.props;
            curPageSubs.delete(channelId);
            await this.props.setCurPageSubs(curPageSubs);
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    componentWillReceiveProps = async (nextProps) => {
        try {
            if (this.state.loadingSubBox != nextProps.loadingSubBox) {
                await this.setState({loadingSubBox: nextProps.loadingSubBox});
            }
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    render() {
        const { subs } = this.state;
        const { curPageSubs } = this.props;

        // const channelDetailsStyle = {
        //     display: this.state.hover ? 'inline' : 'none'
        // }

        // console.log(curPageSubs);

        const channels = subs.map((channel, idx) => (
            <div className = 'channel-info'>
                {/* Thumbnail */}
                <a href = {'https://www.youtube.com/channel/' + channel.resourceId.channelId} target = '_blank'>
                    {
                        // The video list contains the current channel
                        curPageSubs.has(channel.resourceId.channelId) &&
                        <img className = 'channel-thumbnail' src = {channel.thumbnails.default.url} alt = 'Thumbnail' />
                    }
                    {
                        // The video list does not contain the current channel
                        !curPageSubs.has(channel.resourceId.channelId) &&
                        <img className = 'channel-thumbnail grayscale' src = {channel.thumbnails.default.url} alt = 'Thumbnail' />
                    }
                </a>

                <div className = 'channel-details'>
                    {/* Channel Name */}
                    <a className = 'channel-name' href = {'https://www.youtube.com/channel/' + channel.resourceId.channelId} target = '_blank'>
                        {channel.title}
                    </a>

                    {/* Add or remove channel from the current video list */}
                    <div className = 'list-add-button'>
                        {
                            // The video list contains the current channel
                            curPageSubs.has(channel.resourceId.channelId) &&
                            <Button bsStyle = 'danger' bsSize = 'xsmall' onClick = {this.removeFromList} id = {channel.resourceId.channelId} disabled = {this.state.loadingSubBox}>
                                <Glyphicon glyph='minus'/>
                                Remove from list
                            </Button>
                        }
                        {
                            // The video list does not contain the current channel
                            !curPageSubs.has(channel.resourceId.channelId) &&
                            <Button bsStyle = 'primary' bsSize = 'xsmall' onClick = {this.addToList} id = {channel.resourceId.channelId} disabled = {this.state.loadingSubBox}>
                                <Glyphicon glyph='plus'/>
                                Add to list
                            </Button>
                        }
                    </div>
                </div>
            </div>
        ));

        return (
            <div className = 'Sidebar' >
                {channels}
            </div>
        );
    }
}

 // onMouseOver = {() => this.mouseOverSidebar()} onMouseOut = {() => this.mouseOutSidebar()}

export default Sidebar;
