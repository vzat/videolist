import React, { Component } from 'react';
import './css/App.css';

const OAUTH2_CLIENT_ID = '537371083703-tt6pkisgd198nrr04b3tb5mepdi22fep.apps.googleusercontent.com';
const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

class SubBox extends Component {
    state = {
        subBox: []
    }

    render() {
        const { subBox } = this.state;
        const videoList = subBox.map((index, value) => (
            <li> {subBox[value].title} </li>
        ));

        return (
            <div className = 'SubBox'>
                Videos: { videoList.length }
                <br/>
                <ul> { videoList } </ul>
            </div>
        );
    }
}

export default SubBox;
