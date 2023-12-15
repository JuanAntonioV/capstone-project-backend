const { okResponse } = require('../utils/response');
const { notFoundResponse } = require('../utils/response');
const { errorResponse } = require('../utils/response');
const { errorMessage } = require('../utils/response');

const { Product } = require('../models');
const { getCurrentDate } = require('../utils/helpers');
const productController = {};
/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

productController.index = async (req, res) => {
    okResponse(res, {
        message: 'Hello World',
    });
};

productController.create = async (req, res, next) => {
    const { name, price } = req.body;

    if (!name || typeof name !== 'string') {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    } else if (name.trim() === '') {
        return errorResponse(res, errorMessage.ERROR_INPUT_VALIDATION);
    }

    if (!price || typeof price !== 'number' || price <= 0) {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    }

    try {
        const newProduct = await Product.create({
            name,
            price,
        });

        okResponse(res, newProduct);
    } catch (error) {
        next(error);
    }
};

productController.getAll = async (req, res, next) => {
    try {
        const activeProduct = await Product.findAll({
            order: [['createdAt', 'DESC']],
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

        okResponse(res, product);
    } catch (error) {
        next(error);
    }
};

productController.update = async (req, res, next) => {
    const productId = req.params.id;
    const { name, price, status } = req.body;

    if (!name || typeof name !== 'string') {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    } else if (name.trim() === '') {
        return errorResponse(res, errorMessage.ERROR_INPUT_VALIDATION);
    }

    if (!price || typeof price !== 'number' || price <= 0) {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    }

    try {
        let product = await Product.findByPk(productId, {});

        if (!product) {
            notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
            return;
        }
        product = await product.update({
            name,
            price,
            status,
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
        await product.destroy();
        okResponse(res, product);
    } catch (error) {
        next(error);
    }
};
module.exports = productController;
