'use strict';

const { hashPassword } = require('../utils/helpers');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        const users = [
            {
                name: 'admin',
                email: 'admin@email.com',
                password: await hashPassword('admin123'),
                status: true,
            },
            {
                name: 'user',
                email: 'user@email.com',
                password: await hashPassword('user123'),
                status: true,
            },
        ];

        await queryInterface.bulkInsert('users', users, {});

        const admin = await queryInterface.sequelize.query(
            `SELECT id from users where name='admin'`
        );

        const user = await queryInterface.sequelize.query(
            `SELECT id from users where name='user'`
        );

        const adminId = admin[0][0].id;
        const userId = user[0][0].id;

        await queryInterface.sequelize.query(
            `INSERT INTO users_roles (user_id, role_id) VALUES (${adminId}, 1)`
        );

        await queryInterface.sequelize.query(
            `INSERT INTO users_roles (user_id, role_id) VALUES (${userId}, 2)`
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */

        await queryInterface.bulkDelete('users', null, {});
        await queryInterface.bulkDelete('users_roles', null, {});
    },
};
