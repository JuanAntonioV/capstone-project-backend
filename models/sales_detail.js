'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sales_Detail extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Sales_Detail.belongsTo(models.Sales, {
                foreignKey: 'sales_id',
                as: 'sales',
            });
            Sales_Detail.belongsTo(models.Product, {
                foreignKey: 'product_id',
                as: 'product',
            });
        }
    }
    Sales_Detail.init(
        {
            sales_id: DataTypes.STRING(50),
            product_id: DataTypes.BIGINT,
            quantity: DataTypes.INTEGER,
            amount: DataTypes.BIGINT,
        },
        {
            sequelize,
            modelName: 'Sales_Detail',
        }
    );
    return Sales_Detail;
};
