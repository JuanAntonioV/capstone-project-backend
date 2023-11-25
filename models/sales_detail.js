'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Sales_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Sales_Detail.belongsTo(models.Sales, { foreignKey: 'id_Sales' });
      Sales_Detail.belongsTo(models.Product, { foreignKey: 'id_Product' });
    }
  }
  Sales_Detail.init({
    sales_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT,
    quantity: DataTypes.INTEGER,
    amount: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'Sales_Detail',
  });
  return Sales_Detail;
};