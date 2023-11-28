const { Category } = require('../models');
const { okResponse } = require('../utils/response');
/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const getActiveCategories = async (req, res, next) => {
    try {
        const activeCategories = await Category.findAll({
            attributes: {
                exclude: ['createdAt', 'updatedAt'],
            },
            where: {
                status: true,
            },
        });

        okResponse(res, activeCategories);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActiveCategories,
};
