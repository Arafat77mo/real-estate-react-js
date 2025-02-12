// src/echo.js
import Echo from 'laravel-echo';

import Pusher from 'pusher-js';
window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'reverb',
    key: 'bvtmxl6bfbbiwmwin5xf',
    wsHost: "localhost",
    wsPort:8080,
    wssPort: 443 ?? 443,
    enabledTransports: ['ws', 'wss'],

});


export default echo;
