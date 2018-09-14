const User = require('../models').User;
const Permission = require('../models').Permission;
const Chat = require('../models').Chat;
const News = require('../models').News;
const Setting = require('../models').Setting;
const jwt = require('jsonwebtoken');

// Создаем токен
const payload = { username: 'admin' };
const userToken = jwt.sign(payload, 'secret', { expiresIn: 24 * 60 * 60 });

module.exports = {
  up: (queryInterface, Sequelize) => {
    return User
      .create({
        username: 'admin',
        password: 'admin',
        permission: {
          chat: { C: true, R: true, U: true, D: true },
          setting: { C: true, R: true, U: true, D: true },
          news: { C: true, R: true, U: true, D: true }
        },
        access_token: userToken,
        image: '',
        firstName: 'Severus',
        surName: 'Snape',
        middleName: ''
      }, {
        include: [{
          model: Permission,
          as: 'permission',
          include: [
            { model: Chat, as: 'chat' },
            { model: News, as: 'news' },
            { model: Setting, as: 'setting' }]
        }]
      });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('Person', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {});
  }
};
