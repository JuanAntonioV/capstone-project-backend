const Joi = require('joi');

const createUserSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama tidak boleh kosong',
        'any.required': 'Nama tidak boleh kosong',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email tidak boleh kosong',
        'string.email': 'Email tidak valid',
        'any.required': 'Email tidak boleh kosong',
    }),
    password: Joi.string().required().min(6).messages({
        'string.empty': 'Password tidak boleh kosong',
        'any.required': 'Password tidak boleh kosong',
    }),
    password_confirmation: Joi.valid(Joi.ref('password')).required().messages({
        'any.only': 'Password tidak sama dengan konfirmasi password',
        'any.required': 'Password tidak boleh kosong',
        'string.min': 'Password minimal 6 karakter',
    }),
    roles: Joi.array()
        .items(Joi.number().integer().min(1))
        .required()
        .messages({
            'array.base': 'Role harus berupa array',
            'array.empty': 'Role tidak boleh kosong',
            'any.required': 'Role tidak boleh kosong',
            'number.base': 'Role harus berupa integer',
            'number.empty': 'Role tidak boleh kosong',
            'number.min': 'Role minimal 1',
        }),
}).with('password', 'password_confirmation');

const updateUserSchema = Joi.object({
    name: Joi.string().required().messages({
        'string.empty': 'Nama tidak boleh kosong',
        'any.required': 'Nama tidak boleh kosong',
    }),
    email: Joi.string().email().required().messages({
        'string.empty': 'Email tidak boleh kosong',
        'string.email': 'Email tidak valid',
        'any.required': 'Email tidak boleh kosong',
    }),
    password: Joi.string().min(6).empty().messages({
        'string.min': 'Password minimal 6 karakter',
        'any.ref': 'Password tidak sama dengan konfirmasi password',
    }),
    password_confirmation: Joi.valid(Joi.ref('password')).empty().messages({
        'any.only': 'Password tidak sama dengan konfirmasi password',
    }),
    status: Joi.boolean().required().messages({
        'boolean.base': 'Status harus berupa boolean',
        'boolean.empty': 'Status tidak boleh kosong',
        'any.required': 'Status tidak boleh kosong',
    }),
    roles: Joi.array()
        .items(Joi.number().integer().min(1))
        .required()
        .messages({
            'array.base': 'Role harus berupa array',
            'array.empty': 'Role tidak boleh kosong',
            'any.required': 'Role tidak boleh kosong',
            'number.base': 'Role harus berupa integer',
            'number.empty': 'Role tidak boleh kosong',
            'number.min': 'Role minimal 1',
        }),
}).with('password', 'password_confirmation');

module.exports = {
    createUserSchema,
    updateUserSchema,
};
