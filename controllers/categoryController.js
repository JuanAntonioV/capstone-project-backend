const { Category, sequelize } = require('../models');
const { getCurrentDate } = require('../utils/helpers');
const {
    okResponse,
    errorResponse,
    notFoundResponse,
    errorMessage,
} = require('../utils/response');
const {
    createCategorySchema,
    updateCategorySchema,
} = require('../validators/categoryValidator');

// Create a new Category
const createCategory = async (req, res, next) => {
    const { name } = req.body;

    const validate = createCategorySchema.validate({ name });

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        const newCategory = await Category.create({ name });
        okResponse(res, newCategory);
    } catch (err) {
        next(err);
    }
};

// Read all Categories
const getAllCategories = async (req, res, next) => {
    try {
        const allCategories = await Category.findAll({
            attributes: [
                'id',
                'name',
                'status',
                [
                    sequelize.fn(
                        'DATE_FORMAT',
                        sequelize.col('createdAt'),
                        '%d %M %Y'
                    ),
                    'createdAt',
                ],
            ],
        });

        okResponse(res, allCategories);
    } catch (err) {
        next(err);
    }
};

// Read a single Category by ID
const getCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId, {
            attributes: [
                'id',
                'name',
                'status',
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

        if (!category) {
            return notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
        }

        okResponse(res, category);
    } catch (err) {
        next(err);
    }
};

// Update a Category by ID
const updateCategoryById = async (req, res, next) => {
    const categoryId = req.params.id;
    const { name, status } = req.body;

    const validate = updateCategorySchema.validate({ name, status });

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        let category = await Category.findByPk(categoryId);
        if (!category) {
            notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
            return;
        }
        category = await category.update({
            name,
            status,
            updatedAt: getCurrentDate(),
        });

        okResponse(res, category);
    } catch (error) {
        next(error);
    }
};

// Delete a Category by ID
const deleteCategoryById = async (req, res, next) => {
    try {
        const categoryId = req.params.id;
        const category = await Category.findByPk(categoryId);

        if (!category) {
            return errorResponse(res, 'Category not found', 404);
        }

        await category.destroy();
        okResponse(res, { message: 'Category deleted successfully' });
    } catch (err) {
        next(err);
    }
};

module.exports = {
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
};
