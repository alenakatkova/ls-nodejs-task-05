const express = require('express');
const router = express.Router();

const ctrlBasic = require('../controllers/basic');

router.get('/', ctrlBasic.getHome);

module.exports = router;
