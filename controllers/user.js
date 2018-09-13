const User = require('../models').User;
const Permission = require('../models').Permission;
const Chat = require('../models').Chat;
const News = require('../models').News;
const Setting = require('../models').Setting;
const psw = require('../libs/password');
const jwt = require('jsonwebtoken');

const secret = 'what a secret';

module.exports = {
  register: (req, res, next) => {
    const body = JSON.parse(req.body);

    // Переименовываем свойстов img в image
    let userObj = Object.assign(body);
    userObj.image = userObj.img;
    delete userObj.img;

    // Данные для создания токена
    const payload = { username: userObj.username };

    // Ищем пользователя в БД; создаем, если логин не занят
    User.findOne({
      where: { username: userObj.username },
      include: [{
        model: Permission,
        as: 'permission',
        include: [
          { model: Chat, as: 'chat' },
          { model: News, as: 'news' },
          { model: Setting, as: 'setting' }]
      }]
    })
      .then((user) => {
        if (!user) {
          User
            .create(userObj, {
              include: [{
                model: Permission,
                as: 'permission',
                include: [
                  { model: Chat, as: 'chat' },
                  { model: News, as: 'news' },
                  { model: Setting, as: 'setting' }]
              }]
            })
            .then((user) => {
              const userToken = jwt.sign(payload, secret, { expiresIn: 24 * 60 * 60 });
              const result = Object.assign(user.dataValues, { access_token: userToken });

              req.session.user = result;
              return res.status(201).send(result);
            });
        } else {
          res.status(404).json('Username already exists!');
        }
      });
  },

  logIn: (req, res, next) => {
    console.log(req.body)
  }
};
