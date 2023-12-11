const { okResponse, errorResponse } = require('../utils/response');
const { Sales, sequelize, Category, Product, User } = require('../models');
const { generateSalesId } = require('../utils/helpers');
const {
    createTransactionSchema,
} = require('../validators/transactionValidator');

/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

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
                exclude: ['createdAt', 'updatedAt'],
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

        // create transaction
        const sales = await Sales.create({
            id: salesId,
            user_id: userId,
            category_id,
            total_payment: totalAmount,
            pickup_date,
            delivery_date,
        });

        // create sales detail
        const salesDetail = validProducts.map((product) => ({
            sales_id: salesId,
            ...product,
        }));

        await sales.createSalesDetail(salesDetail);

        okResponse(res, {
            sales_id: salesId,
        });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getUserTransaction,
    getTransactionDetail,
    createTransaction,
};
