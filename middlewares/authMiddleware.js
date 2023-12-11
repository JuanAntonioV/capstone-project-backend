const { AccessToken, sequelize } = require('../models');
const { errorResponse } = require('../utils/response');

const checkUserToken = async (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return errorResponse(res, 'Unauthorized', 401);
    }
    try {
        const accessToken = await AccessToken.findOne({
            where: { token },
            attributes: ['id', 'user_id', 'token', 'ipAddress'],
            include: [
                {
                    association: 'user',
                    attributes: [
                        'id',
                        'name',
                        'email',
                        'status',
                        [
                            sequelize.fn(
                                'DATE_FORMAT',
                                sequelize.col('user.createdAt'),
                                '%d %M %Y'
                            ),
                            'registered_at',
                        ],
                    ],
                    include: [
                        {
                            association: 'roles',
                            attributes: ['id', 'name'],
                            through: {
                                attributes: [],
                            },
                        },
                    ],
                },
            ],
        });

        if (!accessToken) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        req.user = accessToken.user;
        next();
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'Unauthorized', 401);
    }
};

const checkUserRole = (roles) => {
    return async (req, res, next) => {
        const { user } = req;
        const userRoles = user.roles.map((role) => role.name);
        const isRoleMatch = roles.some((role) => userRoles.includes(role));
        if (!isRoleMatch) {
            return errorResponse(res, 'Forbidden', 403);
        }
        next();
    };
};

module.exports = {
    checkUserToken,
    checkUserRole,
};
