'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class SalesDetail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            SalesDetail.belongsTo(models.Sales, {
                foreignKey: 'sales_id',
                as: 'sales',
            });
            SalesDetail.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product',
            });
        }
    }
    SalesDetail.init(
        {
            sales_id: DataTypes.STRING(50),
            product_id: DataTypes.BIGINT,
            quantity: DataTypes.INTEGER,
            amount: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: 'SalesDetail',
        }
    );
    return SalesDetail;
};
