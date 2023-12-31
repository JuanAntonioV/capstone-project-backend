const { User, sequelize, AccessToken } = require('../models');
const { checkPassword } = require('../utils/helpers');
const { okResponse, errorResponse } = require('../utils/response');
const jwt = require('jsonwebtoken');
const { loginSchema } = require('../validators/authValidator');

/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const login = async (req, res, next) => {
    const { email, password, isRemember } = req.body;

    const validate = loginSchema.validate(req.body);

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
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

        if (!user.status) {
            return errorResponse(res, 'Akun anda telah dinonaktifkan', 401);
        }

        const isPasswordValid = await checkPassword(password, user.password);

        if (!isPasswordValid) {
            return errorResponse(res, 'Email atau password salah', 401);
        }

        // make user.roles only return the role id
        const plainUser = user.get({ plain: true });
        delete plainUser.password;
        const roles = plainUser.roles.map((role) => role.id);

        const userWithRoles = {
            ...plainUser,
            roles,
        };

        const tokenExpireIn = isRemember ? '7d' : '1d';
        // in minutes
        const tokenExpireInValue = isRemember ? 7 * 24 * 60 : 24 * 60;

        const token = jwt.sign(userWithRoles, process.env.JWT_SECRET, {
            expiresIn: tokenExpireIn,
        });

        await AccessToken.create({
            user_id: user.id,
            token,
            ipAddress: req.ip,
        });

        okResponse(res, {
            user: userWithRoles,
            token,
            token_expire_in: tokenExpireInValue,
        });
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

const me = async (req, res, next) => {
    try {
        const user = req.user;

        okResponse(res, user);
    } catch (err) {
        console.log(err);
        next(err);
    }
};

module.exports = {
    login,
    logout,
    me,
};
