module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Permissions', // name of Target model
      'newsId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'News', // name of Source model
          key: 'id' // key in Source model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Permissions', // name of Target model
      'newsId' // key we want to remove
    );
  }
};
