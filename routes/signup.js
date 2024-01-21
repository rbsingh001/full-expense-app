const express = require('express');
const router = express.Router();

const signupController = require('../controller/signup');

router.post('/user/signup', signupController);

module.exports = router;