const { User, sequelize } = require("../models");
const { okResponse, errorResponse, notFoundResponse, errorMessage, serverErrorResponse } = require("../utils/response");

const { encryptWithAES } = require("../utils/crypto");

const updateUserPassword = async (req, res) => {
  const userId = req.params.id;
  const { password } = req.body;
  if (!password || typeof password !== "string") {
    return errorResponse(res, errorMessage.ERROR_PARAMS_VALIDATION);
  } else if (password.trim() === "") {
    return errorResponse(res, errorMessage.ERROR_INPUT_VALIDATION);
  }

  try {
    let user = await User.findByPk(userId);
    if (!user) {
      return notFoundResponse(res, errorMessage.ERROR_NOT_FOUND);
    }

    user = await user.update(
      {
        password: encryptWithAES(password),
      },
      {
        returning: true,
      }
    );

    const updatedUser = user;

    okResponse(res, updatedUser);
  } catch (error) {
    console.error(error);
    serverErrorResponse(res, errorMessage.ERROR_SERVER);
  }
};

module.exports = {
  updateUserPassword,
};
