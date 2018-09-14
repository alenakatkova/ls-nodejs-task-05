const Article = require('../models').Article;
const User = require('../models').User;

module.exports = {
  get: (req, res, next) => {
    Article
      .findAll({ include: [{ model: User, as: 'user' }] }) // ищем в т.ч. данные об авторе новости
      .then(articles => res.status(200).send(articles)); // возвращаем все новости
  },

  add: (req, res, next) => {
    const body = JSON.parse(req.body);

    User
      .findById(body.userId) // ищем автора новости в таблице юзеров
      .then(user => {
        Article
          .create(Object.assign(body, { user: user })) // создаем новость и ассоциируем ее с автором из таблицы юзеров
          .then(() => {
            Article
              .findAll({ include: [{ model: User, as: 'user' }] }) // ищем в т.ч. данные об авторе новости
              .then(articles => res.status(200).send(articles)); // возвращаем все новости
          });
      });
  },

  update: (req, res, next) => {
    const filledIn = JSON.parse(req.body);

    Article
      .findById(filledIn.id)
      .then((old) => {
        old.text = (filledIn.text !== old.text) ? filledIn.text : old.text;
        old.theme = (filledIn.theme !== old.theme) ? filledIn.theme : old.theme;

        old.save().then(() => {
          Article
            .findAll({ include: [{ model: User, as: 'user' }] }) // ищем в т.ч. данные об авторе новости
            .then(articles => res.status(200).send(articles)); // возвращаем все новости
        });
      });
  },

  delete: (req, res, next) => {
    Article
      .findById(req.params.id)
      .then(article => article.destroy()) // удаление новости из БД
      .then(() => {
        Article
          .findAll({ include: [{ model: User, as: 'user' }] }) // ищем в т.ч. данные об авторе новости
          .then(articles => res.status(200).send(articles)); // возвращаем все новости
      });
  }
};
