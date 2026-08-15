const router = require('express').Router();
const {
	register,
	login,
	tokenLogin,
	signOut,
	demoLogin,
} = require('../controllers/auth');

router.route('/signup').post(register);
router.route('/signin').post(login);
router.route('/signin/token').post(tokenLogin);
router.route('/signout').post(signOut);
router.route('/demo').post(demoLogin);

module.exports = router;
