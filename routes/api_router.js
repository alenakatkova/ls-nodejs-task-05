const express = require('express');
const router = express.Router();
const user = require('../controllers/user');

router.post('/saveNewUser', user.register);
router.put('/updateUser/:id', user.update);
router.post('/login', user.logIn);

module.exports = router;
