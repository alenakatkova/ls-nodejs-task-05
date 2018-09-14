const User = require('../models').User;
const Permission = require('../models').Permission;
const Chat = require('../models').Chat;
const News = require('../models').News;
const Setting = require('../models').Setting;
const psw = require('../libs/password');
const jwt = require('jsonwebtoken');
const token = require('../config/config');

module.exports = {
  register: (req, res, next) => {
    const body = JSON.parse(req.body);

    // Переименовываем свойстов img в image
    let userObj = Object.assign(body);
    userObj.image = userObj.img;
    delete userObj.img;

    // Создаем токен
    const payload = { username: userObj.username };
    const userToken = jwt.sign(payload, token.secret, { expiresIn: token.expiresIn });
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
              return res
                .cookie('access_token', userToken, { expires: new Date(Date.now() + token.expiresIn) })
                .status(201)
                .send(user.dataValues);
            });
        } else {
          res.status(404).json('Username already exists!');
        }
      });
  },

  logIn: (req, res, next) => {
    const body = JSON.parse(req.body);
    console.log(body);
    User
      .findOne({
        where: { username: body.username },
        include: [{
          model: Permission,
          as: 'permission',
          include: [
            { model: Chat, as: 'chat' },
            { model: News, as: 'news' },
            { model: Setting, as: 'setting' }]
        }]
      })
      .then(user => {
        if (!user) {
          console.log('Такого пользователя не существует');
          return res.status(400).send('User does not exist');
        } else if (!psw.validPassword(body.password, user.password)) {
          console.log('Неправильный пароль');
          return res.status(400).send('Wrong password');
        } else {
          if (body.remembered) {
            return res
              .cookie('access_token', user.access_token, { expires: new Date(Date.now() + token.expiresIn) })
              .status(201)
              .send(user.dataValues);
          }
          return res.status(201).send(user.dataValues);
        }
      });
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
        console.log(filledIn)
        // Вносим изменения в ФИО
        old.surName = (filledIn.surName !== old.surName) ? filledIn.surName : old.surName;
        old.firstName = (filledIn.firstName !== old.firstName) ? filledIn.firstName : old.firstName;
        old.middleName = (filledIn.middleName !== old.middleName) ? filledIn.middleName : old.middleName;

        // Вносим изменения в пароль, если старый введен верно
        if (filledIn.password) {
          if (psw.validPassword(filledIn.oldPassword, old.password)) {
            psw.setPassword(filledIn.password).then(hash => {
              old.password = hash;
              old.save();
            });
          } else {
            return res.status(400).send('Incorrect password');
          }
        }

        // Сохраняем изменения в БД и возвращаем объект пользователя
        old.save().then(user => res.status(201).send(user.dataValues));
      });
  }
};
