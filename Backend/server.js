//Express App Imports
const express = require('express');
const path = require('path');
const http = require('http');

const helmet = require('helmet');
const cors = require('cors');
const rateLimiter = require('express-rate-limit');
const sanitize = require('./middleware/sanitize');

const morgan = require('morgan');

require('dotenv').config();

const connectDB = require('./db/connect');

const isProduction = process.env.NODE_ENV === 'production';

//Start Express App
const app = express();
const server = http.createServer(app);

// CORS Origin Configuration
const sanitizeOrigin = (url) => (url ? url.replace(/\/+$/, '') : '');

const rawOrigins = [
	process.env.LOCAL_CLIENT_URL || 'http://localhost:5173',
	process.env.DEPLOYED_CLIENT_URL,
	'http://localhost:3000',
	'https://admin.socket.io',
	...(process.env.ALLOWED_ORIGINS
		? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
		: []),
].filter(Boolean);

const allowedOrigins = rawOrigins.map(sanitizeOrigin);

//scoket.io
const io = require('socket.io')(server, {
	cors: {
		origin: allowedOrigins,
		methods: ['GET', 'POST'],
		credentials: true,
	},
});
require('./socketio')(io);

//Admin UI - development only, it exposes live server internals
if (!isProduction) {
	const { instrument } = require('@socket.io/admin-ui');
	instrument(io, { auth: false });
}

app.set('trust proxy', 1);

//Security Middleware
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, //15 minutes
		max: 100, //limit each IP to 100 requests per windowMs
		standardHeaders: 'draft-7',
		legacyHeaders: false,
	})
);
app.use(express.json());
app.use(helmet()); //set security HTTP headers
app.use(
	cors({
		origin: allowedOrigins,
		credentials: true,
	})
); //enable CORS
app.use(sanitize()); //prevent XSS attacks & NoSQL injection
app.use(morgan('common')); //logger

//Static client build
const clientDist = path.join(__dirname, '..', 'Frontend', 'dist');
app.use(express.static(clientDist));

//Define Routes Here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/room', require('./routes/room'));
app.use('/api/user', require('./middleware/auth'), require('./routes/user'));

app.get('/api/health', (req, res) => {
	res.status(200).json({ success: true, msg: 'Server is healthy' });
});

// SPA fallback. Express 5 uses path-to-regexp v8, where a bare '/*' is no
// longer a valid pattern - an unnamed wildcard throws at registration time.
app.use((req, res, next) => {
	if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
	res.sendFile(path.join(clientDist, 'index.html'), (err) => {
		if (err) next();
	});
});

//Error Handling Middleware
app.use(require('./middleware/error-handler'));

//Function Start
async function start() {
	try {
		// Validate required environment variables
		if (!process.env.JWT_SECRET) {
			throw new Error('JWT_SECRET environment variable is required');
		}
		if (!process.env.JWT_LIFETIME) {
			console.warn('JWT_LIFETIME not set, using default value: 7d');
		}
		if (!process.env.MONGO_URL) {
			throw new Error('MONGO_URL environment variable is required');
		}

		await connectDB(process.env.MONGO_URL);
		console.log('Connected to the DataBase Successfully');
		server.listen(PORT, () => {
			console.log(`Server is listening on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(`Error: ${error}`);
		process.exit(1);
	}
}
start();
