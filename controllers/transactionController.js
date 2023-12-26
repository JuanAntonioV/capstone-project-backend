const { okResponse, errorResponse } = require('../utils/response');
const {
    Sales,
    sequelize,
    Category,
    Product,
    User,
    SalesDetail,
} = require('../models');
const { generateSalesId } = require('../utils/helpers');
const {
    createTransactionSchema,
} = require('../validators/transactionValidator');
const { salesStatus } = require('../entities/salesEntities');
const { Op } = require('sequelize');
const moment = require('moment');
const _ = require('lodash');

/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const getAllTransaction = async (req, res, next) => {
    try {
        const fromDate = req.query.from;
        const toDate = req.query.to;
        const page = req.query.page || 1;
        const limit = Number(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const search = req.query.search || null;

        const where = {};

        if (_.isEmpty(fromDate) && _.isEmpty(toDate)) {
            where.createdAt = {
                [Op.between]: [
                    moment().startOf('month').format('YYYY-MM-DD'),
                    moment().endOf('month').format('YYYY-MM-DD'),
                ],
            };
        } else if (_.isEmpty(fromDate)) {
            where.createdAt = {
                [Op.between]: [
                    moment().startOf('month').format('YYYY-MM-DD'),
                    moment(toDate).endOf('month').format('YYYY-MM-DD'),
                ],
            };
        } else if (_.isEmpty(toDate)) {
            where.createdAt = {
                [Op.between]: [
                    moment(fromDate).startOf('month').format('YYYY-MM-DD'),
                    moment().endOf('month').format('YYYY-MM-DD'),
                ],
            };
        } else {
            where.createdAt = {
                [Op.between]: [
                    moment(fromDate).format('YYYY-MM-DD'),
                    moment(toDate).format('YYYY-MM-DD'),
                ],
            };
        }

        // if search exist will search by id or user name
        if (search) {
            where[Op.or] = [
                {
                    id: {
                        [Op.like]: `%${search}%`,
                    },
                },
                {
                    createdAt: {
                        [Op.like]: `%${search}%`,
                    },
                },
            ];
        }

        const sales = await Sales.findAll({
            where,
            offset,
            limit,
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
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

        // get total rows
        const totalRows = await Sales.count({
            where,
        });

        // get total pages
        const lastPage = Math.ceil(totalRows / limit);

        const response = {
            page: parseInt(page),
            limit,
            totalRows: sales.length,
            lastPage,
            data: sales,
        };

        okResponse(res, response);
    } catch (err) {
        next(err);
    }
};

const getUserTransaction = async (req, res, next) => {
    try {
        // const userId = req.user.id;
        // console.log(req.user);

        const sales = await Sales.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
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
                {
                    association: 'sales_detail',
                    attributes: [],
                },
            ],
            group: ['Sales.id'],
        });

        okResponse(res, sales);
    } catch (err) {
        next(err);
    }
};

const getTransactionDetail = async (req, res, next) => {
    try {
        const salesId = req.params.id;
        // const userId = req.user.id;
        // console.log(userId);

        const sales = await Sales.findOne({
            attributes: {
                exclude: ['updatedAt'],
                include: [
                    [
                        sequelize.literal(
                            'DATE_FORMAT(Sales.createdAt, "%Y-%m-%d")'
                        ),
                        'transaction_date',
                    ],
                    [
                        sequelize.literal(
                            '(SELECT COUNT(*) FROM sales_details WHERE sales_details.sales_id = Sales.id)'
                        ),
                        'total_item',
                    ],
                ],
            },
            where: {
                id: salesId,
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
                {
                    association: 'sales_detail',
                    attributes: {
                        exclude: ['createdAt', 'updatedAt'],
                    },
                    include: {
                        association: 'product',
                        attributes: {
                            exclude: ['createdAt', 'updatedAt'],
                        },
                    },
                },
            ],
        });

        okResponse(res, sales);
    } catch (err) {
        next(err);
    }
};

const createTransaction = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { products, category_id, pickup_date, delivery_date, user_id } =
            req.body;

        // validate
        const validate = createTransactionSchema.validate(req.body);

        if (validate.error) {
            return errorResponse(res, validate.error.message, 400);
        }

        // check category
        const isCategoryExist = await Category.findOne({
            where: {
                id: category_id,
                status: 1,
            },
        });

        if (!isCategoryExist) {
            return errorResponse(res, 'Category tidak ditemukan', 404);
        }

        // check product
        const productsId = products.map((product) => product.product_id);

        const isProductExist = await Product.findAll({
            where: {
                id: productsId,
                status: 1,
            },
        });

        const validProducts = isProductExist.map((product) => {
            const productData = products.find(
                (item) => item.product_id === product.id
            );

            return {
                product_id: product.id,
                qty: productData.qty,
                price: product.price,
                amount: product.price * productData.qty,
            };
        });

        if (isProductExist.length !== productsId.length) {
            return errorResponse(res, 'Product tidak ditemukan', 404);
        }

        // check user
        const isUserExist = await User.findOne({
            where: {
                id: user_id,
                status: 1,
            },
        });

        if (!isUserExist) {
            return errorResponse(res, 'User tidak ditemukan', 404);
        }

        // generate sales id
        const salesId = generateSalesId();

        const totalAmount = validProducts.reduce(
            (acc, product) => acc + product.qty * product.price,
            0
        );

        if (!pickup_date) {
            pickup_date = null;
        }

        if (!delivery_date) {
            delivery_date = null;
        }

        // create transaction
        await Sales.create({
            id: salesId,
            user_id: userId,
            category_id,
            status: salesStatus.PROSES,
            total_payment: totalAmount,
            pickup_date,
            delivery_date,
        });

        // create sales detail
        const salesDetail = validProducts.map((product) => ({
            sales_id: salesId,
            product_id: product.product_id,
            quantity: product.qty,
            amount: product.amount,
        }));

        await SalesDetail.bulkCreate(salesDetail);

        okResponse(res, {
            sales_id: salesId,
        });
    } catch (err) {
        next(err);
    }
};

const confirmTransaction = async (req, res, next) => {
    try {
        const salesId = req.params.id;

        const sales = await Sales.findOne({
            where: {
                id: salesId,
                status: salesStatus.MENUNGGU_PEMBAYARAN,
            },
        });

        if (!sales) {
            return errorResponse(res, 'Transaksi tidak ditemukan', 404);
        }

        await Sales.update(
            {
                status: salesStatus.PROSES,
            },
            {
                where: {
                    id: salesId,
                },
            }
        );

        okResponse(res, null, 'Transaksi berhasil dikonfirmasi');
    } catch (err) {
        next(err);
    }
};

const cancelTransaction = async (req, res, next) => {
    try {
        const salesId = req.params.id;

        const sales = await Sales.findOne({
            where: {
                id: salesId,
                status: salesStatus.MENUNGGU_PEMBAYARAN,
            },
        });

        if (!sales) {
            return errorResponse(res, 'Transaksi tidak ditemukan', 404);
        }

        await Sales.update(
            {
                status: salesStatus.DIBATALKAN,
            },
            {
                where: {
                    id: salesId,
                },
            }
        );

        okResponse(res, null, 'Transaksi berhasil dibatalkan');
    } catch (err) {
        next(err);
    }
};

const finishTransaction = async (req, res, next) => {
    try {
        const salesId = req.params.id;

        const sales = await Sales.findOne({
            where: {
                id: salesId,
                status: salesStatus.PROSES,
            },
        });

        if (!sales) {
            return errorResponse(res, 'Transaksi tidak ditemukan', 404);
        }

        await Sales.update(
            {
                status: salesStatus.BERHASIL,
            },
            {
                where: {
                    id: salesId,
                },
            }
        );

        okResponse(res, null, 'Transaksi berhasil diselesaikan');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserTransaction,
    getTransactionDetail,
    getAllTransaction,
    createTransaction,
    confirmTransaction,
    cancelTransaction,
    finishTransaction,
};
