'use strict';

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

        const products = [
            {
                name: 'Kaos',
                price: 20000,
            },
            {
                name: 'Celana',
                price: 30000,
            },
            {
                name: 'Jaket',
                price: 50000,
            },
            {
                name: 'Sepatu',
                price: 100000,
            },
            {
                name: 'Topi',
                price: 25000,
            },
        ];

        await queryInterface.bulkInsert('Products', products, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('Products', null, {});
    },
};
