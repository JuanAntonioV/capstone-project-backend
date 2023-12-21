const { okResponse } = require('../utils/response');
const { Sales, Product, User, sequelize } = require('../models');
const { salesStatus } = require('../entities/salesEntities');
const { Op } = require('sequelize');
const moment = require('moment-timezone');

/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const getDashboardStats = async (req, res, next) => {
    try {
        const startPeriod = moment().startOf('month').toDate();
        const endPeriod = moment().endOf('month').toDate();

        const totalRevenue = await Sales.findOne({
            where: {
                status: salesStatus.BERHASIL,
                createdAt: {
                    [Op.between]: [startPeriod, endPeriod],
                },
            },
            attributes: [
                [
                    sequelize.fn('sum', sequelize.col('total_payment')),
                    'total_revenue',
                ],
            ],
        });
        const totalSales = await Sales.count({
            where: {
                createdAt: {
                    [Op.between]: [startPeriod, endPeriod],
                },
            },
        });
        const totalProducts = await Product.count();
        const totalUsers = await User.count();

        const data = [
            {
                label: 'Total Pemasukan',
                value: totalRevenue.get('total_revenue') || '0',
                type: 'money',
                description: 'Periode Bulan Ini',
            },
            {
                label: 'Total Pemesanan',
                value: totalSales,
                type: 'number',
                description: 'Periode Bulan Ini',
            },
            {
                label: 'Total Produk',
                value: totalProducts,
                type: 'number',
                description: 'Data Keseluruhan',
            },
            {
                label: 'Total Pengguna',
                value: totalUsers,
                type: 'number',
                description: 'Data Keseluruhan',
            },
        ];

        return okResponse(res, data);
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    getDashboardStats,
};
