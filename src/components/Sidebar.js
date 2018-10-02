import React, { Component } from 'react';
import './css/Sidebar.css';

class Sidebar extends Component {
    state = {
        subs: [],
        hover: false
    }

    componentDidMount = () => {
        this.getSubs();
    }

    getSubs = async () => {
        try {
            if (!sessionStorage.getItem('subs-fetched')) {
                setTimeout(this.getSubs(), 1000);
                return;
            }

            const subs = await JSON.parse(localStorage.getItem('subscriptions'));

            console.log(subs);

            await this.setState({subs});
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    }

    // mouseOverSidebar = async () => {
    //     try {
    //         if (!this.state.hover) {
    //             await new Promise(resolve => { setTimeout(resolve, 100) });
    //             if (!this.state.hover) await this.setState({hover: true});
    //         }
    //     }
    //     catch (err) {
    //        throw new Error(err);
    //     }
    // }
    //
    // mouseOutSidebar = async () => {
    //     try {
    //         if (this.state.hover) {
    //             await new Promise(resolve => { setTimeout(resolve, 100) });
    //             if (this.state.hover) await this.setState({hover: false});
    //         }
    //     }
    //     catch (err) {
    //        throw new Error(err);
    //     }
    // }

    render() {
        const { subs } = this.state;

        // const channelDetailsStyle = {
        //     display: this.state.hover ? 'inline' : 'none'
        // }

        const channels = subs.map((channel, idx) => (
            <div className = 'channel-info'>
                <a href = {'https://www.youtube.com/channel/' + channel.resourceId.channelId} target = '_blank'>
                    <img className = 'channel-thumbnail' src = {channel.thumbnails.default.url} alt = 'Thumbnail' />
                </a>
                <a className = 'channel-details' href = {'https://www.youtube.com/channel/' + channel.resourceId.channelId} target = '_blank'>
                    {channel.title}
                </a>
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
