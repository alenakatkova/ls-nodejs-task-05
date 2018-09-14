module.exports = (sequelize, DataTypes) => {
  const Article = sequelize.define('Article', {
    text: DataTypes.STRING,
    date: DataTypes.DATE,
    theme: DataTypes.STRING
  }, {});
  Article.associate = (models) => {
    Article.belongsTo(models.User, {
      as: 'user'
    });
  };
  return Article;
};
