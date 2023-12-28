const { updateUserPassword } = require('../controllers/passwordController');
const { checkUserToken } = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.put('/users/:id/password', checkUserToken, updateUserPassword);
};
