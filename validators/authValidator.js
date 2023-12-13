const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required().messages({
        'string.email': 'Email tidak valid',
        'string.empty': 'Email tidak boleh kosong',
        'any.required': 'Email tidak boleh kosong',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password minimal 6 karakter',
        'string.empty': 'Password tidak boleh kosong',
        'any.required': 'Password tidak boleh kosong',
    }),
    isRemember: Joi.boolean(),
});

const registerSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama tidak boleh kosong',
        'any.required': 'Nama tidak boleh kosong',
    }),
    email: Joi.string().email().required().messages({
        'string.email': 'Email harus berupa email',
        'string.empty': 'Email tidak boleh kosong',
        'any.required': 'Email tidak boleh kosong',
    }),
    password: Joi.string().min(6).required().messages({
        'string.min': 'Password minimal 6 karakter',
        'string.empty': 'Password tidak boleh kosong',
        'any.required': 'Password tidak boleh kosong',
    }),
    roles: Joi.array().items(Joi.number().integer()).required().messages({
        'array.base': 'Roles harus berupa array',
        'array.empty': 'Roles tidak boleh kosong',
        'any.required': 'Roles tidak boleh kosong',
    }),
});

module.exports = {
    loginSchema,
    registerSchema,
};
