'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    access_token: { type: DataTypes.STRING, allowNull: false },
    image: DataTypes.STRING,
    firstName: DataTypes.STRING,
    surName: DataTypes.STRING,
    middleName: DataTypes.STRING
  }, {});
  User.associate = (models) => {
    // associations can be defined here
  };
  return User;
};
