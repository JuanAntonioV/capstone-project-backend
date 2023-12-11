'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('Sales', {
            id: {
                allowNull: false,
                autoIncrement: false,
                primaryKey: true,
                type: Sequelize.STRING(50),
            },
            user_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Users',
                    key: 'id',
                },
            },
            category_id: {
                type: Sequelize.BIGINT,
                references: {
                    model: 'Categories',
                    key: 'id',
                },
            },
            total_payment: {
                type: Sequelize.BIGINT,
            },
            pickup_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            delivery_date: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            status: {
                type: Sequelize.INTEGER,
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
        await queryInterface.dropTable('Sales');
    },
};
