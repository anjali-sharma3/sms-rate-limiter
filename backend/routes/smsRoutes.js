const express = require('express');
const { sendSMS, getStats } = require('../controllers/smsController');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.post('/send', rateLimiter, sendSMS);
router.get('/stats', getStats);

module.exports = router;
