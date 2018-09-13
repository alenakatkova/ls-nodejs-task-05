const psw = require('../libs/password');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    image: DataTypes.STRING,
    firstName: DataTypes.STRING,
    surName: DataTypes.STRING,
    middleName: DataTypes.STRING
  }, {});
  User.associate = (models) => {
    User.belongsTo(models.Permission, {
      as: 'permission'
    });
  };
  User.beforeCreate((user, options) => {
    return psw.setPassword(user.password).then(hash => {
      user.password = hash;
    });
  });
  return User;
};
