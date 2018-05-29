const { google } = require('googleapis');

const SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

const oauth2Client = new google.auth.OAuth2(
    '537371083703-tt6pkisgd198nrr04b3tb5mepdi22fep.apps.googleusercontent.com',
    'cG0bdkgIHgUmt5lkpKSCZj32',
    'https://vzat.github.io/videolist'
);

google.options({ auth: oauth2Client });

const api = {
    authenticate: async () => {
        const authUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: SCOPES
        });

        console.log('Auth Url: ', authUrl);
    }
    // authorize: (clientId, clientSecret) => {
    //     const redirectUrl = 'http://localhost:3000';
    //     const oauth2Client = new OAuth2(clientId, clientSecret, redirectUrl);
    //
    //     const authUrl = oauth2Client.generateAuthUrl({
    //         access_type: 'offline',
    //         scope: SCOPES
    //     });
    //
    //     console.log('Auth Url: ', authUrl);
    // }
};

export default api;
