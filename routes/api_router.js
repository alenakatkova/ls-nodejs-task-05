const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const articles = require('../controllers/articles');

router.post('/saveNewUser', user.register);
router.put('/updateUser/:id', user.update);
router.post('/login', user.logIn);
router.put('/updateNews/:id', articles.update);
router.delete('/deleteNews/:id', articles.delete);
router.get('/getNews', articles.get);

module.exports = router;
