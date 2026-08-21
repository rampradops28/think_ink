/**
 * Runtime configuration.
 *
 * URLs come from Vite env vars so the same build can point at a local server or
 * a deployed one. In production both default to same-origin, which lets the API
 * be served from the host that serves the client.
 */

const rawBackendURL =
	import.meta.env.VITE_BACKEND_URL ||
	import.meta.env.VITE_SERVER_API_URL ||
	import.meta.env.VITE_API_URL ||
	(import.meta.env.DEV ? 'http://localhost:8000' : 'https://think-ink-backend-2802-artz.onrender.com');

const backendBaseURL = rawBackendURL.replace(/\/+$/, '').replace(/\/api$/, '');

const socketURL =
	import.meta.env.VITE_SOCKET_URL?.replace(/\/+$/, '') || backendBaseURL;

const serverAPIURL =
	import.meta.env.VITE_SERVER_API_URL?.replace(/\/+$/, '') ||
	import.meta.env.VITE_API_URL?.replace(/\/+$/, '') ||
	`${backendBaseURL}/api`;

// Backing resolution of the shared canvas, independent of the display size.
const canvasResolution = 2048;
const canvasRatio = 1.5;

export default {
	socketURL,
	serverAPIURL,
	canvasResolution,
	// Kept as an alias: the original spelling is referenced across the canvas code.
	canvadResolution: canvasResolution,
	canvasRatio,
};

