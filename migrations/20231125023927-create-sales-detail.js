'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Sales_Details', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.BIGINT,
            },
            sales_id: {
                type: Sequelize.STRING(50),
                allowNull: false,
                references: {
                    model: 'Sales',
                    key: 'id',
                },
            },
            product_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Products',
                    key: 'id',
                },
            },
            quantity: {
                type: Sequelize.INTEGER,
            },
            amount: {
                type: Sequelize.BIGINT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
                defaultValue: Sequelize.fn('NOW'),
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('Sales_Details');
    },
};
