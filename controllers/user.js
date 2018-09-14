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

    // Создаем токен
    const payload = { username: userObj.username };
    const userToken = jwt.sign(payload, secret, { expiresIn: 24 * 60 * 60 });
    userObj['access_token'] = userToken;

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
              req.session.user = user.dataValues;
              res.cookie('access_token', userToken);
              return res.status(201).send(user.dataValues);
            });
        } else {
          res.status(404).json('Username already exists!');
        }
      });
  },

  logIn: (req, res, next) => {
    console.log(req.body)
  },

  update: (req, res, next) => {
    const filledIn = JSON.parse(req.body);

    // Ищем нужного пользователя в БД
    User.findById(filledIn.id, {
      include: [{
        model: Permission,
        as: 'permission',
        include: [
          { model: Chat, as: 'chat' },
          { model: News, as: 'news' },
          { model: Setting, as: 'setting' }]
      }]
    })
      .then((old) => {
        // Вносим изменения в ФИО
        old.surName = (filledIn.surName !== old.surName) ? filledIn.surName : old.surName;
        old.firstName = (filledIn.firstName !== old.firstName) ? filledIn.firstName : old.firstName;
        old.middleName = (filledIn.middleName !== old.middleName) ? filledIn.middleName : old.middleName;

        // Вносим изменения в пароль, если старый введен верно
        if (filledIn.password && psw.validPassword(filledIn.oldPassword, old.password)) {
          psw.setPassword(filledIn.password).then(hash => {
            old.password = hash;
          });
        } else {
          return res.status(400).send('Incorrect password');
        }

        // Сохраняем изменения в БД и возвращаем объект пользователя
        old.save().then(user => res.status(201).send(user.dataValues));
      });
  }
};
