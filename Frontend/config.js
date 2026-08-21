const rawBackendURL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
const backendBaseURL = rawBackendURL.replace(/\/+$/, '');
const socketURL = import.meta.env.VITE_SOCKET_URL || backendBaseURL;
const serverAPIURL = import.meta.env.VITE_SERVER_API_URL || `${backendBaseURL}/api`;

const canvadResolution = 2048;
const canvasRatio = 1.5;

export default {
	socketURL,
	serverAPIURL,
	canvadResolution,
	canvasRatio,
};

