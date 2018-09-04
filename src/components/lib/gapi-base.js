// const API_KEY = 'AIzaSyB7niGu-h27sxsn-UIQr399-p4tUB0TWLI';
// const OAUTH2_CLIENT_ID = '537371083703-tt6pkisgd198nrr04b3tb5mepdi22fep.apps.googleusercontent.com';
// const OAUTH2_SCOPES = ['https://www.googleapis.com/auth/youtube.readonly'];
// const YT_DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];

// const clientComponents = [{name: 'youtube', version: 'v3'}];

const gapiB = {
    // clientComponents: name*, version
    load: async (clientComponents) => {
        try {
            // Load gapi client and auth2 at the same time
            const script = document.createElement('script');
            script.src = 'https://apis.google.com/js/client:auth2.js';

            script.onload = async () => {
                // Wait for script to load
                while (!script.getAttribute('gapi_processed')) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                // Load other client components
                for (const idx in clientComponents) {
                    const comp = clientComponents[idx];

                    if (comp.version) {
                        await window.gapi.client.load(comp.name, comp.version);
                    }
                    else {
                        await window.gapi.client.load(comp.name);
                    }
                }

                script.setAttribute('gapi_components_loaded', true);
            }

            document.body.appendChild(script);

            // Wait to finish loading components
            while (!script.getAttribute('gapi_components_loaded')) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        }
        catch (err) {
            throw new Error(JSON.stringify(err));
        }
    },
    authorize: async (clientId, scopes, discoveryDocs, forcePopup) => {
        try {
            let authorized = localStorage.getItem('authorized-api');
            let immediate = true;

            // Check if the user already authorized the app
            if (!authorized || forcePopup) {
                immediate = false;
            }

            // Authorize app
            const response = await window.gapi.auth.authorize({
                client_id: clientId,
                scope: scopes,
                immediate
            });

            // Check if the authorization was successful
            if (response && !response.error) {
                localStorage.setItem('authorized-api', true);
                await window.gapi.client.init({discoveryDocs});
            }
            else if (!forcePopup) {
                this.authorize(scopes, discoveryDocs, forcePopup = true);
            }
        }
        catch (err) {
            console.log(err);
            throw new Error(JSON.stringify(err));
        }
    }
};

export default gapiB;
