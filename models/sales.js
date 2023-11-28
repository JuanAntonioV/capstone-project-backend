'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class Sales extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Sales.belongsTo(models.User, { foreignKey: 'id_User' });
            Sales.belongsTo(models.Category, { foreignKey: 'id_Category' });

            Sales.hasMany(models.Sales_Detail, { foreignKey: 'id_Sales' });
        }
    }
    Sales.init(
        {
            user_id: DataTypes.BIGINT,
            category_id: DataTypes.BIGINT,
            total_payment: DataTypes.BIGINT,
            status: DataTypes.INTEGER,
        },
        {
            sequelize,
            modelName: 'Sales',
        }
    );
    return Sales;
};
