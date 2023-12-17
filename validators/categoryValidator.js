const Joi = require('joi');

const createCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama tidak boleh kosong',
        'any.required': 'Nama tidak boleh kosong',
    }),
});

const updateCategorySchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama tidak boleh kosong',
        'any.required': 'Nama tidak boleh kosong',
    }),
    status: Joi.boolean().required().messages({
        'boolean.base': 'Status harus berupa boolean',
        'boolean.empty': 'Status tidak boleh kosong',
        'any.required': 'Status tidak boleh kosong',
    }),
});

module.exports = {
    createCategorySchema,
    updateCategorySchema,
};
