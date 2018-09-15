const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const articles = require('../controllers/articles');
const settings = require('../controllers/settings');

// User
router.post('/login', user.logIn);
router.post('/saveNewUser', user.register);
router.put('/updateUser/:id', user.update);
router.post('/saveUserImage/:id', user.saveImage);

// News
router.put('/updateNews/:id', articles.update);
router.post('/newNews', articles.add);
router.delete('/deleteNews/:id', articles.delete);
router.get('/getNews', articles.get);

// Settings
router.get('/getUsers', settings.getUsers);
router.put('/updateUserPermission/:id', settings.updateUserPermission);
router.delete('/deleteUser/:id', settings.deleteUser);

module.exports = router;
