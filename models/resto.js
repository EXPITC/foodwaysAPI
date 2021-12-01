'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class resto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
     static associate(models) {
      // // define association here
       resto.belongsTo(models.users, {
         as: 'owner',
         foreignKey: {
           name: 'ownerId'
         }
       })
    }
  };
  resto.init({
    ownerId: DataTypes.INTEGER,
    title: DataTypes.STRING,
    loc: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'resto',
  });
  return resto;
};