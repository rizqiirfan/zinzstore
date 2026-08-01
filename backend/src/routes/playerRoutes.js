const express = require('express');
const router = express.Router();
const { checkPlayer } = require('../controllers/playerController');

router.post('/check', checkPlayer);

module.exports = router;
