const { User, sequelize } = require('../models');
const { okResponse } = require('../utils/response');
/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const getActiveUser = async (req, res, next) => {
    try {
        const activeUsers = await User.findAll({
            where: {
                status: true,
            },
            attributes: [
                'id',
                'name',
                'email',
                'status',
                'is_admin',
                [
                    sequelize.fn(
                        'DATE_FORMAT',
                        sequelize.col('createdAt'),
                        '%d %M %Y'
                    ),
                    'registered_at',
                ],
            ],
        });

        okResponse(res, activeUsers);
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getActiveUser,
};
