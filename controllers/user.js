const User = require('../models').User;
const psw = require('../libs/password');
const jwt = require('jwt-simple');
const secret = 'xxx';

module.exports = {
  register: (req, res, next) => {
    let receivedData = '';
    let body = {};
    req
      .on('data', (chunk) => {
        receivedData += chunk;
      })
      .on('end', () => {
        body = JSON.parse(receivedData);
        console.log(body);

        const payload = { username: body.username };

        User
          .create({
            access_token: jwt.encode(payload, secret),
            username: body.username,
            password: psw.setPassword(body.password),
            firstName: body.firstName,
            surName: body.surName,
            middleName: body.middleName,
            image: body.img
          })
          .then((user) => {
            req.session.user = user.dataValues;
            return res.status(201).send(user);
          })
          .catch((error) => res.status(400).send(error));
      });
  },

  logIn: (req, res, next) => {
    // ?
  }
};
