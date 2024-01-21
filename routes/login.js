const express = require('express');
const router = express.Router();

const loginController = require('../controller/login');

router.post('/user/login', loginController);

module.exports = router;