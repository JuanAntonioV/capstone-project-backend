const { okResponse } = require('../utils/response');
const { notFoundResponse } = require('../utils/response');
const { errorResponse } = require('../utils/response');
const { errorMessage } = require('../utils/response');

const { Product } = require('../models');
const { getCurrentDate, getFileUrl } = require('../utils/helpers');
const {
    createProductSchema,
    updateProductSchema,
} = require('../validators/productValidator.');
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const { deleteFile } = require('../utils/uploads');
const { Op } = require('sequelize');

const productController = {};
/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

productController.create = async (req, res, next) => {
    const { name, price } = req.body;

    const validate = createProductSchema.validate(req.body);

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        if (!req.file) {
            return errorResponse(res, 'Gambar tidak boleh kosong', 400);
        }

        const filePath = req.file.path;

        const newProduct = await Product.create({
            name,
            price,
            image: filePath,
        });

        okResponse(res, newProduct);
    } catch (error) {
        next(error);
    }
};

productController.getAll = async (req, res, next) => {
    try {
        const status = req.query.status;
        const search = req.query.search;
        const where = {};

        if (status) {
            where.status = status;
        }

        if (search) {
            where.name = { [Op.like]: `%${search}%` };
        }

        const activeProduct = await Product.findAll({
            order: [['createdAt', 'DESC']],
            where,
        });

        activeProduct.forEach((product) => {
            if (product.image) {
                product.image = getFileUrl(req, product.image);
            }
        });

        okResponse(res, activeProduct);
    } catch (err) {
        next(err);
    }
};

productController.getById = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByPk(productId, {});
        if (!product) {
            notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
            return;
        }

        if (product.image) {
            product.image = getFileUrl(req, product.image);
        }

        okResponse(res, product);
    } catch (error) {
        next(error);
    }
};

productController.update = async (req, res, next) => {
    const productId = req.params.id;
    const { name, price, status, image } = req.body;

    const validate = updateProductSchema.validate(req.body);

    if (validate.error) {
        return errorResponse(res, validate.error.message, 400);
    }

    try {
        let product = await Product.findByPk(productId, {});

        if (!product) {
            notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
            return;
        }

        let imagePath = null;

        if (!_.isEmpty(req.file)) {
            const filePath = req.file.path;
            // delete old file
            if (product.image) {
                deleteFile(product.image);
            }
            imagePath = filePath;
        } else {
            if (!_.isEmpty(image)) {
                imagePath = product.image;
            }
        }

        if (!imagePath) {
            if (product.image) {
                deleteFile(product.image);
            }
        }

        product = await product.update({
            name,
            price,
            status,
            image: imagePath,
            updatedAt: getCurrentDate(),
        });

        okResponse(res, product);
    } catch (error) {
        next(error);
    }
};

productController.delete = async (req, res, next) => {
    const productId = req.params.id;
    try {
        const product = await Product.findByPk(productId, {});
        if (!product) {
            errorResponse(res, errorMessage.ERROR_NOT_FOUND);
            return;
        }

        if (product.image) {
            deleteFile(product.image);
        }

        await product.destroy();
        okResponse(res, product);
    } catch (error) {
        next(error);
    }
};
module.exports = productController;
