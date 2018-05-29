const gapi = window.gapi;

const OAUTH2_CLIENT_ID = '537371083703-tt6pkisgd198nrr04b3tb5mepdi22fep.apps.googleusercontent.com';
const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];

const auth = {
    googleApiClientReady: () => {
        gapi.auth.init(function () {
            window.setTimeout(checkAuth, 1);
        });
    }
}

async function checkAuth () {
    const response = await gapi.auth.authorize({
        client_id: OAUTH2_CLIENT_ID,
        scope: OAUTH2_SCOPES,
        immediate: true
    });

    console.log(response);
}

export default auth;
