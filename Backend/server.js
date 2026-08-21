//Express App Imports
const express = require('express');
const path = require('path');
const http = require('http');

const helmet = require('helmet');
const cors = require('cors');
const xss = require('xss-clean');
const rateLimiter = require('express-rate-limit');

const morgan = require('morgan');

require('express-async-errors');
require('dotenv').config();

const connectDB = require('./db/connect');

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
//Admin UI
const { instrument } = require('@socket.io/admin-ui');
instrument(io, { auth: false });

//Setting Environment
const PORT = process.env.PORT || 5000;
app.set('trust proxy', 1);

//Security Middleware
app.use(
	rateLimiter({
		windowMs: 15 * 60 * 1000, //15 minutes
		max: 100, //limit each IP to 100 requests per windowMs
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
app.use(xss()); //prevent XSS attacks
app.use(morgan('common')); //logger

//Routes
app.use('/', express.static('../client/dist'));
app.use('/assests', express.static('../client/dist/assests'));

//Define Routes Here

app.use('/api/auth', require('./routes/auth'));
app.use('/api/room', require('./routes/room'));
app.use('/api/user', require('./middleware/auth'), require('./routes/user'));

app.get('/*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/dist/index.html'), (err) => {
		if (err) {
			console.error('Error sending file:', err);
		}
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
		console.log('Connected to the DataBase Sucessfully');
		server.listen(PORT, () => {
			console.log(`Server is listening on http://localhost:${PORT}`);
		});
	} catch (error) {
		console.log(`Error: ${error}`);
		process.exit(1);
	}
}
start();
