module.exports = (sequelize, DataTypes) => {
  const Permission = sequelize.define('Permission', {
    chatId: DataTypes.INTEGER,
    newsId: DataTypes.INTEGER,
    settingId: DataTypes.INTEGER
  }, {});
  Permission.associate = (models) => {
    Permission.hasOne(models.User, {
      foreignKey: 'permissionId'
    });
    Permission.belongsTo(models.Chat, {
      as: 'chat'
    });
    Permission.belongsTo(models.News, {
      as: 'news'
    });
    Permission.belongsTo(models.Setting, {
      as: 'setting'
    });
  };
  return Permission;
};
