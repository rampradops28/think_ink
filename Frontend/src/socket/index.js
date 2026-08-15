import { io } from 'socket.io-client';
import config from '../../config';

// `process` does not exist in the browser. `config.socketURL` already resolves
// to the current origin in production and the local server in development.
export const socket = io(config.socketURL, {
	autoConnect: false,
	// Prefer WebSocket but keep polling as a fallback for restrictive proxies.
	transports: ['websocket', 'polling'],
});
