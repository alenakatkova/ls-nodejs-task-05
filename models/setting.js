module.exports = (sequelize, DataTypes) => {
  const Setting = sequelize.define('Setting', {
    C: DataTypes.BOOLEAN,
    R: DataTypes.BOOLEAN,
    U: DataTypes.BOOLEAN,
    D: DataTypes.BOOLEAN
  }, {});
  Setting.associate = (models) => {
    Setting.hasOne(models.Permission, {
      foreignKey: 'settingId'
    });
  };
  return Setting;
};
