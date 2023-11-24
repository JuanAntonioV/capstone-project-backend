const { okResponse } = require('../utils/response');

const getAppDetails = async (req, res) => {
    okResponse(res, {
        message: 'Hello World',
    });
};

module.exports = {
    getAppDetails,
};
