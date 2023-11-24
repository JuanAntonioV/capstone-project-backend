'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SalesDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      SalesDetail.belongsTo(Sales, { foreignKey: 'id_Sales' });
      SalesDetail.belongsTo(Product, { foreignKey: 'id_Product' });
    }
  }
  SalesDetail.init({
    sales_id: DataTypes.BIGINT,
    product_id: DataTypes.BIGINT,
    quantity: DataTypes.INTEGER,
    amount: DataTypes.BIGINT,
    id: DataTypes.BIGINT
  }, {
    sequelize,
    modelName: 'SalesDetail',
  });
  return SalesDetail;
};