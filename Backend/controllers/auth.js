const User = require('../models/user');
const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const sendUserData = (user, res, msg) => {
	try {
		const token = user.generateToken();

		//check if profile image is set or not
		const profileImage =
			user.profileImage && user.profileImage.data && user.profileImage.contentType
				? {
						base64Image: user.profileImage.data.toString('base64'),
						contentType: user.profileImage.contentType,
				  }
				: null;

		res.status(StatusCodes.CREATED).json({
			data: {
				userId: user._id,
				name: user.name,
				email: user.email,
				bio: user.bio,
				profileImage,
				token,
			},
			success: true,
			msg,
		});
	} catch (error) {
		console.error('Error generating token:', error);
		res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
			success: false,
			msg: 'Error generating authentication token. Please check server configuration.',
		});
	}
};

const register = async (req, res) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		throw new BadRequestError('Please provide all details');
	}
	const userExist = await User.findOne({ email }); // Using findOne

	if (userExist) {
		return res.status(StatusCodes.CONFLICT).json({
			success: false,
			msg: 'User with this email already exists',
		}); // Conflict status
	}
	const user = await User.create({ name, email, password });
	sendUserData(user, res, 'User Registered Successfully');
};

const login = async (req, res) => {
	const { email, password } = req.body;
	if (!email && !password) {
		throw new BadRequestError('Please provide email and password');
	} else if (!email) {
		throw new BadRequestError('Please provide email');
	} else if (!password) {
		throw new BadRequestError('Please provide password');
	}

	const user = await User.findOne({ email });

	if (!user) {
		throw new UnauthenticatedError('Email Not Registered.');
	}

	const isPasswordCorrect = await user.comparePassword(password);
	if (!isPasswordCorrect) {
		throw new UnauthenticatedError('Invalid Password.');
	}

	sendUserData(user, res, 'User Login Successfully');
};
const tokenLogin = async (req, res) => {
	const { token } = req.body;
	if (!token) {
		throw new BadRequestError('Please provide token');
	}
	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET);
		// console.log(decoded);

		const user = await User.findById(decoded.userId);
		if (!user) {
			throw new UnauthenticatedError('Invalid Token');
		}
		sendUserData(user, res, 'User Login Successfully');
	} catch (error) {
		throw new UnauthenticatedError('Invalid Token');
	}
};
const signOut = async (req, res) => {
	res.status(StatusCodes.OK).json({
		success: true,
		msg: 'User Logout Successfully',
	});
};

// Shared "kick the tyres" account.
const DEMO_USER = {
	name: 'Demo User',
	email: 'temp@temp.com',
	password: 'temp@temp.com',
	bio: 'Exploring ThinkInk with the shared demo account.',
};

/**
 * Signs in to the demo account, creating it on first use.
 *
 * The sign-in dialog used to just type these credentials into the form. They
 * referenced an account that only existed in the database of the project this
 * was forked from, so on any fresh install the demo button filled in an email
 * and then failed with "Email Not Registered". Provisioning it server-side
 * makes the demo work on any clone.
 */
const demoLogin = async (req, res) => {
	let user = await User.findOne({ email: DEMO_USER.email });

	if (!user) {
		user = await User.create(DEMO_USER);
	}

	sendUserData(user, res, 'Signed in with the demo account');
};

module.exports = {
	register,
	login,
	tokenLogin,
	signOut,
	demoLogin,
};
