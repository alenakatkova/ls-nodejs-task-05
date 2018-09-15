const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);

// Log requests to the console.
app.use(logger('dev'));

// Parse incoming requests data
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.text());
app.use(bodyParser.json());

// Allow us access the cookies stored in the browser
app.use(cookieParser());

// Session settings
app.use(session({
  store: new FileStore(),
  secret: 'secret of loftschool',
  cookie: {
    path: '/',
    httpOnly: true,
    maxAge: null,
    expires: 600000
  },
  resave: false,
  saveUninitialized: true
}));

// Static files
app.use(express.static(path.join(__dirname, 'dist')));

app.use('/api', require('./routes/api_router')); // обработка запросов к /api
app.use('*', require('./routes/basic_router')); // любой get-запрос вернет index.html

app.listen(3000, function () {
  if (!fs.existsSync('./dist/upload')) {
    fs.mkdirSync('./dist/upload');
  }
  console.log('Example app listening on port 3000!');
});
