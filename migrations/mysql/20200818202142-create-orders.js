'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('orders', {
      id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
      },
      reseller_id: {
        type: Sequelize.INTEGER(11).UNSIGNED,
        allowNull: false,
        references: {
          model: 'resellers',
          key: 'id'
        }
      },
      price: {
        type: Sequelize.FLOAT(11),
        allowNull: false
      },
      cashback: {
        type: Sequelize.FLOAT(11),
        allowNull: false
      },
      status: {
        type: Sequelize.ENUM('approved', 'not approved'),
        allowNull: true,
        defaultValue: 'not approved'
      },
      dataCompra: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    }, {
      engine: 'InnoDB',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('orders');
  }
};