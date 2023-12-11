const { User, sequelize, AccessToken } = require('../models');
const { checkPassword } = require('../utils/helpers');
const {
    okResponse,
    errorResponse,
    errorMessage,
} = require('../utils/response');
const jwt = require('jsonwebtoken');

/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const login = async (req, res, next) => {
    const { email, password } = req.body;

    if (
        !email ||
        typeof email !== 'string' ||
        !password ||
        typeof password !== 'string'
    ) {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    } else if (email.trim() === '' || password.trim() === '') {
        return errorResponse(res, errorMessage.ERROR_INPUT_VALIDATION);
    }

    try {
        const user = await User.findOne({
            where: { email },
            attributes: [
                'id',
                'name',
                'email',
                'status',
                'password',
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
        });

        if (!user) {
            return errorResponse(res, 'Email atau password salah', 401);
        }

        // make user.roles only return the role id
        const plainUser = user.get({ plain: true });
        const roles = plainUser.roles.map((role) => role.id);

        const userWithRoles = {
            ...plainUser,
            roles,
        };

        const isPasswordValid = await checkPassword(password, user.password);

        if (!isPasswordValid) {
            return errorResponse(res, 'Email atau password salah', 401);
        }

        const token = jwt.sign(userWithRoles, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRES_IN,
        });

        await AccessToken.create({
            user_id: user.id,
            token,
            ipAddress: req.ip?.replace('::ffff:', ''),
        });

        okResponse(res, { user: userWithRoles, token });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

const logout = async (req, res, next) => {
    try {
        const token = req.headers.authorization;

        if (!token) {
            return errorResponse(res, 'Unauthorized', 401);
        }

        await AccessToken.destroy({
            where: {
                token,
            },
        });

        okResponse(res, 'Berhasil logout');
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = {
    login,
    logout,
};
