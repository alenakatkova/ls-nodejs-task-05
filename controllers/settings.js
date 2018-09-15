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
    User
      .findById(req.params.id)
      .then(user => {
        // перед удаление пользователя удаляем из таблиц с настройками доступа относящиеся к нему строки
        Permission.findById(user.permissionId).then(permission => {
          Chat.findById(permission.chatId).then(chat => chat.destroy());
          Setting.findById(permission.settingId).then(setting => setting.destroy());
          News.findById(permission.newsId).then(news => news.destroy());
          permission.destroy();
        });
        user.destroy(); // удаление пользователя из БДa
      })
      .then(() => {
        User
          .findAll()
          .then(users => res.status(200).send(users));
      });
  }
};
