const { okResponse } = require('../utils/response');
/*
    This is a sample controller, you can continue to build your own controller
    by following the sample below.
*/

const index = async (req, res) => {
    okResponse(res, {
        message: 'Hello World',
    });
};

module.exports = {
    index,
};
