const User = require('../models').User;
const Permission = require('../models').Permission;
const Chat = require('../models').Chat;
const News = require('../models').News;
const Setting = require('../models').Setting;
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
            image: body.img,
            permission: {
              chat: body.permission.chat,
              news: body.permission.news,
              setting: body.permission.setting
            }
          }, {
            include: [{
              model: Permission,
              as: 'permission',
              include: [
                {
                  model: Chat,
                  as: 'chat'
                },
                {
                  model: News,
                  as: 'news'
                },
                {
                  model: Setting,
                  as: 'setting'
                }
              ]
            }]
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
