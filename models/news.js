module.exports = (sequelize, DataTypes) => {
  const News = sequelize.define('News', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN
  }, {});
  News.associate = (models) => {
    News.hasOne(models.Permission, {
      foreignKey: 'newsId'
    });
  };
  return News;
};
