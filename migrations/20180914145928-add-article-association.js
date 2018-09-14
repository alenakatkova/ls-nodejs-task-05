module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Articles', // name of Target model
      'userId', // name of the key we're adding
      {
        type: Sequelize.INTEGER,
        references: {
          model: 'Users', // name of Source model
          key: 'id' // key in Source model that we're referencing
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Articles', // name of Target model
      'userId' // key we want to remove
    );
  }
};
