'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class transactions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      transactions.belongsTo(models.users, {
        as: 'buyer',
        foreignKey: {
          name: 'buyerId'
        }
      })
      transactions.belongsTo(models.users, {
        as: 'seller',
        foreignKey: {
          name: 'sellerId'
        }
      })
      transactions.belongsToMany(models.products, {
        as: 'product',
        through: {
          model: 'order',
        },
        foreignKey: 'transactionId'
      })
    }
    
  };
  transactions.init({
    status: DataTypes.STRING,
    sellerId: DataTypes.INTEGER,
    buyerId: DataTypes.INTEGER,
    price: DataTypes.INTEGER,
    address: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'transactions',
  });
  return transactions;
};