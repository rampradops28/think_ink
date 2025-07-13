const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: [true, 'Please Provide Name.'],
			minlength: 3,
			maxlength: 50,
		},
		email: {
			type: String,
			required: [true, 'Please provide email.'],
			match: [
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				'Please provide valid email.',
			],
			unique: true,
		},
		password: {
			type: String,
			required: [true, 'Please provide password.'],
			minlength: 8,
		},
		bio: {
			type: String,
			maxlength: 150,
		},
		profileImage: {
			data: Buffer,
			contentType: String,
		},
		myRooms: [
			{
				roomId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Room',
				},
				name: String,
			},
		],
		rooms: [
			{
				roomId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Room',
				},
				name: String,
			},
		],
	},
	{ timestamps: true }
);

UserSchema.pre('save', async function (next) {
	if (!this.isModified('password')) {
		return next(); // If password field is not modified, move to the next middleware
	}

	try {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
		next();
	} catch (error) {
		return next(error);
	}
});

UserSchema.methods.generateToken = function () {
	// Validate JWT_SECRET
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET environment variable is not set');
	}

	// Set default JWT_LIFETIME if not provided or invalid
	let expiresIn = '7d'; // Default to 7 days
	if (process.env.JWT_LIFETIME) {
		// Validate JWT_LIFETIME format
		const validFormats = /^(\d+[smhd]|\d+)$/;
		if (validFormats.test(process.env.JWT_LIFETIME)) {
			expiresIn = process.env.JWT_LIFETIME;
		} else {
			console.warn(`Invalid JWT_LIFETIME format: ${process.env.JWT_LIFETIME}. Using default: 7d`);
		}
	} else {
		console.warn('JWT_LIFETIME not set. Using default: 7d');
	}

	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: expiresIn,
	});
};

UserSchema.methods.comparePassword = async function (pswrd) {
	const isMatch = await bcrypt.compare(pswrd, this.password);
	return isMatch;
};

module.exports = new mongoose.model('User', UserSchema);
