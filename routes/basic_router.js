const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.sendFile('./public/index.html', {
    root: process.cwd()
  });
});

module.exports = router;
