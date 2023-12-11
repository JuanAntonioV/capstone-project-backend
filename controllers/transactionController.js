const { okResponse } = require('../utils/response');
const { Sales, sequelize } = require('../models');
const { generateSalesId } = require('../utils/helpers');

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

// const createTransaction = (req, res, next) => {
//     try {
//         const userId = req.user.id;
//         const { products } = req.body;

//         const salesId = generateSalesId();

//         sales_detail.forEach((item) => {
//             item.sales_id = salesId;
//         });

//         const sales = Sales.create({
//             id: salesId,
//             user_id: userId,
//             sales_detail,
//         });

//         okResponse(res, sales);
//     } catch (err) {
//         next(err);
//     }
// };

module.exports = {
    getUserTransaction,
    getTransactionDetail,
    // createTransaction,
};
