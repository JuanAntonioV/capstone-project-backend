const { okResponse } = require('../utils/response');
const { Sales, Product, User, sequelize } = require('../models');
const { salesStatus } = require('../entities/salesEntities');
const { Op } = require('sequelize');
const moment = require('moment-timezone');
const excelJs = require('exceljs');
const _ = require('lodash');

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

const getExportSales = async (req, res, next) => {
    try {
        const fromDate = req.query.from;
        const toDate = req.query.to;

        const where = {};

        if (!_.isEmpty(fromDate) && !_.isEmpty(toDate)) {
            where.createdAt = {
                [Op.between]: [
                    moment(fromDate).startOf('month'),
                    moment(toDate).endOf('month'),
                ],
            };
        }

        const sales = await Sales.findAll({
            where,
            attributes: {
                exclude: ['updatedAt'],
                include: [
                    [
                        sequelize.literal(
                            '(SELECT COUNT(*) FROM sales_details WHERE sales_details.sales_id = Sales.id)'
                        ),
                        'total_item',
                    ],
                ],
            },
            include: [
                {
                    association: 'user',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt', 'password'],
                    },
                },
                {
                    association: 'category',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                },
            ],
        });

        let workbook = new excelJs.Workbook();

        const sheet = workbook.addWorksheet('Sales');
        sheet.columns = [
            { header: 'ID', key: 'id', width: 25 },
            { header: 'Kategori', key: 'category', width: 25 },
            { header: 'Nama Admin', key: 'admin', width: 25 },
            { header: 'Tanggal Pemesanan', key: 'createdAt', width: 25 },
            { header: 'Jumlah Produk', key: 'total_item', width: 25 },
            { header: 'Status', key: 'status', width: 25 },
            { header: 'Total Pembayaran', key: 'total_payment', width: 25 },
        ];

        await sales.forEach((sale) => {
            let status = '';

            switch (sale.status) {
                case salesStatus.MENUNGGU_PEMBAYARAN:
                    status = 'Menunggu Pembayaran';
                    break;
                case salesStatus.PROSES:
                    status = 'Diproses';
                    break;
                case salesStatus.BERHASIL:
                    status = 'Berhasil';
                    break;
                case salesStatus.DIBATALKAN:
                    status = 'Dibatalkan';
                    break;
                default:
                    status = 'Gagal';
                    break;
            }

            sheet.addRow({
                id: sale.id,
                category: sale.category.name,
                admin: sale.user.name,
                createdAt: moment(sale.createdAt).format('DD-MM-YYYY'),
                total_item: `${sale.dataValues.total_item} Produk`,
                total_payment: sale.total_payment,
                status,
            });
        });

        res.setHeader(
            'Content-Type',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=' + 'sales.xlsx'
        );

        return workbook.xlsx.write(res).then(function () {
            res.status(200).end();
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getDashboardStats,
    getExportSales,
};
