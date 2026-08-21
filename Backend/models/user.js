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

// Mongoose no longer passes a `next` callback to *async* middleware - it awaits
// the returned promise instead. The old signature took `next` and called it,
// which threw "next is not a function" on every save.
UserSchema.pre('save', async function () {
	if (!this.isModified('password')) return;

	const salt = await bcrypt.genSalt(10);
	this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.generateToken = function () {
	// Validate JWT_SECRET
	if (!process.env.JWT_SECRET) {
		throw new Error('JWT_SECRET environment variable is not set');
	}

	// Set default JWT_LIFETIME if not provided or invalid.
	//
	// A unit is required. `jsonwebtoken` reads a bare number as *seconds*, so a
	// value like "20" silently expires every token 20 seconds after login - the
	// previous pattern accepted that and made the app look like it was randomly
	// rejecting valid credentials.
	let expiresIn = '7d';
	const lifetime = process.env.JWT_LIFETIME;

	if (!lifetime) {
		console.warn('JWT_LIFETIME not set. Using default: 7d');
	} else if (!/^\d+\s*(s|m|h|d|w|y)$/i.test(lifetime)) {
		console.warn(
			`Invalid JWT_LIFETIME "${lifetime}" - it needs a unit (e.g. 30m, 24h, 7d). Using default: 7d`
		);
	} else {
		expiresIn = lifetime;
	}

	return jwt.sign({ userId: this._id }, process.env.JWT_SECRET, {
		expiresIn: expiresIn,
	});
};

UserSchema.methods.comparePassword = async function (pswrd) {
	const isMatch = await bcrypt.compare(pswrd, this.password);
	return isMatch;
};

// `mongoose.model` is a factory, not a constructor - calling it with `new`
// happened to work but is not supported.
module.exports = mongoose.model('User', UserSchema);
