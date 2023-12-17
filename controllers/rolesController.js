const {
    okResponse,
    notFoundResponse,
    errorMessage,
    errorResponse,
} = require('../utils/response');
const { Roles, Sequelize } = require('../models');
const { getCurrentDate } = require('../utils/helpers');
const {
    updateRoleSchema,
    createRoleSchema,
} = require('../validators/roleValidator');

/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const getAllRoles = async (req, res, next) => {
    try {
        const allRoles = await Roles.findAll({
            attributes: [
                'id',
                'name',
                'status',
                [
                    Sequelize.fn(
                        'DATE_FORMAT',
                        Sequelize.col('createdAt'),
                        '%Y-%m-%d %H:%i:%s'
                    ),
                    'createdAt',
                ],
            ],
            order: [['createdAt', 'DESC']],
        });
        okResponse(res, allRoles);
    } catch (err) {
        next(err);
    }
};
const getActiveRoles = async (req, res, next) => {
    try {
        const activeRoles = await Roles.findAll({
            where: {
                status: 1,
            },
            attributes: [
                'id',
                'name',
                'status',
                [
                    Sequelize.fn(
                        'DATE_FORMAT',
                        Sequelize.col('createdAt'),
                        '%Y-%m-%d %H:%i:%s'
                    ),
                    'createdAt',
                ],
            ],
        });
        okResponse(res, activeRoles);
    } catch (err) {
        next(err);
    }
};

const getRoleById = async (req, res, next) => {
    try {
        const roleId = req.params.id;

        const allRoles = await Roles.findOne({
            where: {
                id: roleId,
            },
            attributes: [
                'id',
                'name',
                'status',
                [
                    Sequelize.fn(
                        'DATE_FORMAT',
                        Sequelize.col('createdAt'),
                        '%Y-%m-%d %H:%i:%s'
                    ),
                    'createdAt',
                ],
            ],
        });

        if (!allRoles) return notFoundResponse(res, 'Role not found');

        okResponse(res, allRoles);
    } catch (err) {
        next(err);
    }
};
const deleteRoles = async (req, res, next) => {
    try {
        const roleId = req.params.id;

        const role = await Roles.findByPk(roleId);

        if (!role) return notFoundResponse(res, 'Role not found');

        await role.destroy();

        okResponse(res, null, 'Role deleted');
    } catch (err) {
        next(err);
    }
};

const createRoles = async (req, res, next) => {
    const { name } = req.body;

    const validate = createRoleSchema.validate(req.body);

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        if (!name) return badRequestResponse(res, 'Invalid request');

        const role = await Roles.create({
            name,
        });

        okResponse(res, role, 'Role created');
    } catch (err) {
        next(err);
    }
};

const updateRoles = async (req, res, next) => {
    const roleId = req.params.id;
    const { name, status } = req.body;

    const validate = updateRoleSchema.validate(req.body);

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        const role = await Roles.findByPk(roleId);

        if (!role) return notFoundResponse(res, 'Role not found');

        await role.update({
            name,
            status,
            updatedAt: getCurrentDate(),
        });

        okResponse(res, role, 'Role updated');
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllRoles,
    getRoleById,
    deleteRoles,
    createRoles,
    updateRoles,
    getActiveRoles,
};
