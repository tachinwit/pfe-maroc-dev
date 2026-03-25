/**
 * Configuration de Laravel Echo avec Pusher
 * Nécessite : `npm install laravel-echo pusher-js`
 */
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: process.env.REACT_APP_PUSHER_APP_KEY || 'app-key',
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER || 'mt1',
    wsHost: window.location.hostname,
    wsPort: process.env.REACT_APP_PUSHER_PORT ?? 80,
    wssPort: process.env.REACT_APP_PUSHER_PORT ?? 443,
    forceTLS: (process.env.REACT_APP_PUSHER_SCHEME ?? 'https') === 'https',
    enabledTransports: ['ws', 'wss'],
});

export default echo;
