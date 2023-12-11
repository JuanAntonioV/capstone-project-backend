const { User } = require('../models');
const {
    okResponse,
    errorResponse,
    notFoundResponse,
    errorMessage,
} = require('../utils/response');

const { getCurrentDate, hashPassword } = require('../utils/helpers');

const updateUserPassword = async (req, res, next) => {
    const userId = req.params.id;
    const { password } = req.body;
    if (!password || typeof password !== 'string') {
        return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
    } else if (password.trim() === '') {
        return errorResponse(res, errorMessage.ERROR_INPUT_VALIDATION);
    }

    try {
        let user = await User.findByPk(userId);
        if (!user) {
            return notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
        }

        user = await user.update(
            {
                password: hashPassword(password),
                updatedAt: getCurrentDate(),
            },
            {
                returning: true,
            }
        );

        const updatedUser = user;

        okResponse(res, updatedUser);
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateUserPassword,
};
