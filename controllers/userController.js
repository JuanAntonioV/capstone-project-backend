const { User, sequelize } = require('../models');
const {
    okResponse,
    errorResponse,
    notFoundResponse,
    errorMessage,
    serverErrorResponse,
} = require('../utils/response');

const { encryptWithAES } = require('../utils/crypto');
const { getCurrentDate } = require('../utils/helpers');

// Create a new User
const createUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    if (
        !name ||
        typeof name !== 'string' ||
        !email ||
        typeof email !== 'string' ||
        !password ||
        typeof password !== 'string'
    ) {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    } else if (
        name.trim() === '' ||
        email.trim() === '' ||
        password.trim() === ''
    ) {
        return errorResponse(res, errorMessage.ERROR_INPUT_VALIDATION);
    }

    try {
        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: encryptWithAES(password),
        });

        // Add the user ID and role ID to the user_roles table
        await newUser.addRoles([2]); // Assuming the role ID is 2

        okResponse(res, newUser);
    } catch (err) {
        next(err);
    }
};
// Read all Users
const getAllUsers = async (req, res, next) => {
    try {
        const allUsers = await User.findAll({
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
        });

        // make user.roles only return the role id
        const allUsersRoles = allUsers.map((user) => {
            const plainUser = user.get({ plain: true });
            const roles = plainUser.roles.map((role) => role.id);
            return {
                ...plainUser,
                roles,
            };
        });

        okResponse(res, allUsersRoles);
    } catch (err) {
        next(err);
    }
};

// Read a single User by ID
const getUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId, {
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
        });

        if (!user) {
            return notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
        }

        // make user.roles only return the role id
        const plainUser = user.get({ plain: true });
        const roles = plainUser.roles.map((role) => role.id);

        const userWithRoles = {
            ...plainUser,
            roles,
        };

        okResponse(res, userWithRoles);
    } catch (err) {
        next(err);
    }
};

// Update a User by ID
const updateUserById = async (req, res, next) => {
    const userId = req.params.id;
    const { name, email } = req.body;
    console.log(req.body);
    if (
        !name ||
        typeof name !== 'string' ||
        !email ||
        typeof email !== 'string'
    ) {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    } else if (name.trim() === '' || email.trim() === '') {
        return errorResponse(res, errorMessage.ERROR_INPUT_VALIDATION);
    }

    try {
        let user = await User.findByPk(userId);
        if (!user) {
            return notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
        }

        user = await user.update(
            {
                name,
                email,
                updateAt: getCurrentDate(),
            },
            {
                returning: true,
            }
        );

        const updatedUser = user;

        okResponse(res, updatedUser);
    } catch (error) {
        serverErrorResponse(res, errorMessage.ERROR_SERVER);
    }
};

// Delete a User by ID
const deleteUserById = async (req, res, next) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return errorResponse(res, 'User not found', 404);
        }

        // Mengubah status pengguna menjadi 0
        await user.update({ status: 0, updatedAt: getCurrentDate() });

        okResponse(res, null, 'User status updated successfully');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
};
