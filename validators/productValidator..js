const Joi = require('joi');

const createProductSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama tidak boleh kosong',
        'any.required': 'Nama tidak boleh kosong',
    }),
    price: Joi.number().required().messages({
        'number.base': 'Harga harus berupa angka',
        'number.empty': 'Harga tidak boleh kosong',
        'any.required': 'Harga tidak boleh kosong',
    }),
});

const updateProductSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama tidak boleh kosong',
        'any.required': 'Nama tidak boleh kosong',
    }),
    price: Joi.number().required().messages({
        'number.base': 'Harga harus berupa angka',
        'number.empty': 'Harga tidak boleh kosong',
        'any.required': 'Harga tidak boleh kosong',
    }),
    status: Joi.boolean().required().messages({
        'boolean.base': 'Status harus berupa boolean',
        'boolean.empty': 'Status tidak boleh kosong',
        'any.required': 'Status tidak boleh kosong',
    }),
});

module.exports = {
    createProductSchema,
    updateProductSchema,
};
