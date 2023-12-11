const Joi = require('joi');

const createTransactionSchema = Joi.object({
    user_id: Joi.number().integer().required().messages({
        'number.base': 'User ID harus berupa angka',
        'number.empty': 'User ID tidak boleh kosong',
        'any.required': 'User ID tidak boleh kosong',
    }),
    pickup_date: Joi.date().required().greater('now').messages({
        'date.base': 'Tanggal pickup harus berupa tanggal',
        'date.empty': 'Tanggal pickup tidak boleh kosong',
        'any.required': 'Tanggal pickup tidak boleh kosong',
        'date.greater': 'Tanggal pickup harus lebih besar dari hari ini',
    }),
    delivery_date: Joi.date()
        .required()
        .greater(Joi.ref('pickup_date'))
        .messages({
            'date.base': 'Tanggal delivery harus berupa tanggal',
            'date.empty': 'Tanggal delivery tidak boleh kosong',
            'any.required': 'Tanggal delivery tidak boleh kosong',
            'date.greater':
                'Tanggal delivery harus lebih besar dari tanggal pickup',
        }),
    category_id: Joi.number().integer().required().messages({
        'number.base': 'Category ID harus berupa angka',
        'number.empty': 'Category ID tidak boleh kosong',
        'any.required': 'Category ID tidak boleh kosong',
    }),
    products: Joi.array().items(
        Joi.object({
            product_id: Joi.number().integer().required().messages({
                'number.base': 'Product ID harus berupa angka',
                'number.empty': 'Product ID tidak boleh kosong',
                'any.required': 'Product ID tidak boleh kosong',
            }),
            qty: Joi.number().integer().required().messages({
                'number.base': 'Qty harus berupa angka',
                'number.empty': 'Qty tidak boleh kosong',
                'any.required': 'Qty tidak boleh kosong',
            }),
        })
    ),
});

module.exports = {
    createTransactionSchema,
};
