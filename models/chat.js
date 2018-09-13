module.exports = (sequelize, DataTypes) => {
  const Chat = sequelize.define('Chat', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN
  }, {});
  Chat.associate = (models) => {
    Chat.hasOne(models.Permission);
  };
  return Chat;
};
