module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Users', // name of Target model
      'permissionId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Permissions', // name of Source model
          key: 'id' // key in Source model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Users', // name of Target model
      'permissionId' // key we want to remove
    );
  }
};
