const Article = require('../models').Article;
const User = require('../models').User;
const Permission = require('../models').Permission;
const Chat = require('../models').Chat;
const News = require('../models').News;
const Setting = require('../models').Setting;

module.exports = {
  getUsers: (req, res, next) => {
    User
      .findAll({
        include: [{
          model: Permission,
          as: 'permission',
          include: [
            { model: Chat, as: 'chat' },
            { model: News, as: 'news' },
            { model: Setting, as: 'setting' }]
        }]
      }) // ищем в т.ч. данные о настройках доступа каждого пользователя
      .then(users => res.status(200).send(users)); // возвращаем всех пользователей
  },

  updateUserPermission: (req, res, next) => {
    const body = JSON.parse(req.body);

    User
      .findOne({
        where: { permissionId: body.permissionId },
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
        for (let item in body.permission) {
          for (let actionType in body.permission[item]) {
            if (actionType !== 'id') {
              user.permission[item][actionType] = body.permission[item][actionType];
            }
          }
          user.permission[item].save();
        }

        res.status(201).send(user.dataValues);
      });
  },

  deleteUser: (req, res, next) => {
    console.log(req.params)
    User
      .findById(req.params.id, {
        include: [{
          model: Permission,
          as: 'permission',
          include: [
            { model: Chat, as: 'chat' },
            { model: News, as: 'news' },
            { model: Setting, as: 'setting' }]
        }]
      })
      .then(user => user.destroy({
        include: [{
          model: Permission,
          as: 'permission',
          include: [
            { model: Chat, as: 'chat' },
            { model: News, as: 'news' },
            { model: Setting, as: 'setting' }]
        }]})) // удаление новости из БД
      .then(() => {
        User
          .findAll() // ищем в т.ч. данные об авторе новости
          .then(users => res.status(200).send(users)); // возвращаем все новости
      });
  }
};
