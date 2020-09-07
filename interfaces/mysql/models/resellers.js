'use strict';
module.exports = (sequelize, DataTypes) => {
    var Resellers = sequelize.define('Resellers', {
        id: {
            type: DataTypes.INTEGER(11),
            autoIncrement: true,
            allowNull: false,
            primaryKey: true,
            unique: true
          },
        name: {
            type: DataTypes.STRING(64),
            allowNull: false,
            defaultValue: ''
        },
        email: {
            type: DataTypes.STRING(256),
            allowNull: false,
            unique: true
        },
        password: {
            type: DataTypes.STRING(256)
        },
        cpf: {
            type: DataTypes.STRING(11),
            allowNull: false,
            defaultValue: 1
        },
        active: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: 0
          },
    });

    Resellers.associate = function (models) {
        Resellers.hasMany(models.Orders, {
            foreignKey: 'reseller_id',
            onDelete: 'cascade'
        });
      }

    return Resellers;
};
