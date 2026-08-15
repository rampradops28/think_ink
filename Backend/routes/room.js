const router = require('express').Router();
const { isRoomIdValid, getDemoRoom } = require('../controllers/room');

router.route('/isValid').post(isRoomIdValid);
router.route('/demo').get(getDemoRoom);

module.exports = router;
