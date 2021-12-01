'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here 
      users.hasMany(models.resto, {
        as: 'resto',
        foreignKey: {
          name: 'id'
        }
      })
      users.hasMany(models.products, {
        as: 'products',
        foreignKey: {
          name: 'id'
        }
      })
    }
  };
  users.init({
    fullname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    phone: DataTypes.STRING,
    location: DataTypes.STRING,
    image: DataTypes.STRING,
    role: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};