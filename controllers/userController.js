const { User, sequelize } = require('../models');
const {
    okResponse,
    errorResponse,
    notFoundResponse,
    errorMessage,
    serverErrorResponse,
} = require('../utils/response');

const {
    getCurrentDate,
    hashPassword,
    checkPassword,
} = require('../utils/helpers');
const { Op } = require('sequelize');
const {
    createUserSchema,
    updateUserSchema,
} = require('../validators/userValidator');

// Create a new User
const createUser = async (req, res, next) => {
    const { name, email, password, roles } = req.body;

    const validate = createUserSchema.validate(req.body);

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    if (roles.length > 1) {
        return errorResponse(res, 'Role tidak boleh lebih dari 1', 400);
    }

    console.log('req.body', req.body);

    try {
        // Create a new user
        const newUser = await User.create({
            name,
            email,
            password: await hashPassword(password),
        });

        // Add the user ID and role ID to the user_roles table
        await newUser.addRoles(roles);

        okResponse(res, newUser);
    } catch (err) {
        next(err);
    }
};
// Read all Users
const getAllUsers = async (req, res, next) => {
    try {
        const search = req.query.search || '';

        const where = {};

        if (search) {
            where.name = {
                [Op.like]: `%${search}%`,
            };
            where.email = {
                [Op.like]: `%${search}%`,
            };
        }

        const allUsers = await User.findAll({
            where,
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
    const { name, email, password, roles, status } = req.body;

    const validate = updateUserSchema.validate(req.body);

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        let user = await User.findByPk(userId);
        if (!user) {
            return errorResponse(res, 'User tidak ditemukan', 404);
        }

        if (email !== user.email) {
            const isEmailExist = await User.findOne({
                where: {
                    email,
                },
            });

            if (isEmailExist) {
                return errorResponse(res, 'Email sudah digunakan', 400);
            }
        }

        if (password) {
            const isPasswordMatch = await checkPassword(
                password,
                user.password
            );
            if (!isPasswordMatch) {
                const hashPassword = await hashPassword(password);
                user = await user.update(
                    {
                        name,
                        email,
                        password: hashPassword,
                        status,
                        updateAt: getCurrentDate(),
                    },
                    {
                        returning: true,
                    }
                );
            }
        } else {
            user = await user.update(
                {
                    name,
                    email,
                    status,
                    updateAt: getCurrentDate(),
                },
                {
                    returning: true,
                }
            );
        }

        // Update the user ID and role ID to the user_roles table
        await user.setRoles(roles);

        const updatedUser = user;

        okResponse(res, updatedUser);
    } catch (error) {
        next(error);
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

const activedUser = async (req, res, next) => {
    try {
        const userId = req.body.id;
        const user = await User.findByPk(userId);

        if (!user) {
            return errorResponse(res, 'User tidak ditemukan', 404);
        }

        // Mengubah status pengguna menjadi 1
        await user.update({ status: 1, updatedAt: getCurrentDate() });

        okResponse(res, null, 'User berhasil diaktifkan');
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
    activedUser,
};
