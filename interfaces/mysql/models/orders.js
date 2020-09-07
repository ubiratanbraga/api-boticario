'use strict';
module.exports = (sequelize, DataTypes) => {

    var Orders = sequelize.define('Orders', {
        id: {
          type: DataTypes.INTEGER(11),
          autoIncrement: true,
          allowNull: false,
          primaryKey: true,
          unique: true
        },
        reseller_id: {
          type: DataTypes.INTEGER(11),
          allowNull: false,
          references: {
            model: 'resellers',
            key: 'id'
          }
        },
        price: {
          type: DataTypes.FLOAT(11),
          allowNull: false
        },
        cashback: {
          type: DataTypes.FLOAT(11),
          allowNull: false
        },
        status: {
          type: DataTypes.ENUM('approved', 'not approved'),
          allowNull: false
        },
        dataCompra: {
          type: DataTypes.DATE,
          allowNull: false
        },
        createdAt: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updatedAt: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, {
        tableName: 'orders'
      });
    
    return Orders;
};