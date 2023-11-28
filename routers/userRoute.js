const { getActiveUser } = require('../controllers/userController');

module.exports = (router) => {
    router.get('/users/active', getActiveUser);
};
