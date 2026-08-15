const mongoose = require('mongoose');
const Room = require('../models/room');
const { StatusCodes } = require('http-status-codes');

const DEMO_ROOM_NAME = 'Demo Room';

const isRoomIdValid = async (req, res) => {
	const { roomId } = req.body;

	if (!mongoose.Types.ObjectId.isValid(roomId)) {
		return res.status(StatusCodes.BAD_REQUEST).json({
			success: false,
			msg: 'Invalid Room Id',
		});
	}

	const room = await Room.findById(roomId);
	if (!room) {
		return res.status(StatusCodes.NOT_FOUND).json({
			success: false,
			msg: 'Room Not Found',
		});
	}

	res.status(StatusCodes.OK).json({ success: true, msg: 'Room Exist' });
};

/**
 * Returns the shared demo room, creating it on first request.
 *
 * The homepage used to link to a room id hardcoded from the project this was
 * forked from, which does not exist in a fresh database - the demo button
 * always landed on "Room not found". Resolving it server-side means the demo
 * works on any clone without seeding anything by hand.
 */
const getDemoRoom = async (req, res) => {
	let room = await Room.findOne({ name: DEMO_ROOM_NAME });

	if (!room) {
		room = await Room.create({ name: DEMO_ROOM_NAME, chat: [], elements: [], users: [] });
	}

	res.status(StatusCodes.OK).json({
		success: true,
		msg: 'Demo room ready',
		data: { roomId: room._id, name: room.name },
	});
};

module.exports = {
	isRoomIdValid,
	getDemoRoom,
};
