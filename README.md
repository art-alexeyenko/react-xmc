# How to deploy
1. Set REACT_APP_CONTEXT_ID, REACT_APP_EDGE_URL, other env variables in `react` app
2. Build the `react` app. This will also move build artifacts into node-xmcloud-proxy
3. [Temporary, will be adjusted] Create `reactapp` folder under `node-xmcloud-proxy/dist` folder, move everything but `server.bundle.js` from under `dist` in there
4. Run `npm run start` for node-xmcloud-proxy app
