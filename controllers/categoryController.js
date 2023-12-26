const { Category, sequelize } = require('../models');
const { getCurrentDate, getFileUrl } = require('../utils/helpers');
const {
    okResponse,
    errorResponse,
    notFoundResponse,
    errorMessage,
} = require('../utils/response');
const { deleteFile } = require('../utils/uploads');
const {
    createCategorySchema,
    updateCategorySchema,
} = require('../validators/categoryValidator');
const _ = require('lodash');

// Create a new Category
const createCategory = async (req, res, next) => {
    const { name } = req.body;

    const validate = createCategorySchema.validate({ name });

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        if (!req.file) {
            return errorResponse(res, 'Gambar tidak boleh kosong', 400);
        }

        const filePath = req.file.path;

        const newCategory = await Category.create({ name, image: filePath });
        okResponse(res, newCategory);
    } catch (err) {
        next(err);
    }
};

// Read all Categories
const getAllCategories = async (req, res, next) => {
    try {
        const status = req.query.status;

        const where = {};

        if (status) {
            where.status = status;
        }

        const allCategories = await Category.findAll({
            attributes: [
                'id',
                'name',
                'image',
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
            where,
        });

        allCategories.forEach((category) => {
            if (category.image) {
                category.image = getFileUrl(req, category.image);
            }
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
                'image',
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

        if (category.image) {
            category.image = getFileUrl(req, category.image);
        }

        okResponse(res, category);
    } catch (err) {
        next(err);
    }
};

// Update a Category by ID
const updateCategoryById = async (req, res, next) => {
    const categoryId = req.params.id;
    const { name, status, image } = req.body;

    const validate = updateCategorySchema.validate({ name, status });

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        let category = await Category.findByPk(categoryId);
        if (!category) {
            errorResponse(res, errorMessage.ERROR_NOT_FOUND, 404);
            return;
        }

        let imagePath = null;

        if (!_.isEmpty(req.file)) {
            const filePath = req.file.path;
            // delete old file
            if (category.image) {
                deleteFile(category.image);
            }
            imagePath = filePath;
        } else {
            if (!_.isEmpty(image)) {
                imagePath = category.image;
            }
        }

        if (!imagePath) {
            if (category.image) {
                deleteFile(category.image);
            }
        }

        category = await category.update({
            name,
            status,
            image: imagePath,
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

        if (category.image) {
            deleteFile(category.image);
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
