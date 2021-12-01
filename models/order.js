'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      order.belongsTo(models.transactions, {
        
      })
    }
  };
  order.init({
    transactionId: DataTypes.INTEGER,
    productId: DataTypes.INTEGER,
    buyerId:DataTypes.INTEGER,
    qty:DataTypes.INTEGER,
    status: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'order',
  });
  return order;
};