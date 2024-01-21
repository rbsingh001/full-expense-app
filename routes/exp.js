const express = require('express');
const router = express.Router();

const expController = require('../controller/exp');

router.get('/exp', expController.getExp);
router.post('/exp', expController.addExp);
router.delete('/exp/:exp_id', expController.delExp);
module.exports = router;
