'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class AccessToken extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            // user_id
            AccessToken.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'user',
            });
        }
    }
    AccessToken.init(
        {
            user_id: DataTypes.BIGINT,
            token: DataTypes.TEXT,
            ipAddress: DataTypes.STRING,
        },
        {
            sequelize,
            modelName: 'AccessToken',
            tableName: 'access_tokens',
        }
    );
    return AccessToken;
};
