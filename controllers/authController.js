const { User, sequelize, AccessToken } = require('../models');
const { checkPassword } = require('../utils/helpers');
const {
    okResponse,
    errorResponse,
    errorMessage,
} = require('../utils/response');
const jwt = require('jsonwebtoken');
const { loginSchema } = require('../validators/authValidator');

/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const login = async (req, res, next) => {
    const { email, password } = req.body;

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
                token: token.split(' ')[1],
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
