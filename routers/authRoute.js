const { login, logout } = require('../controllers/authController');
const {
    checkUserToken,
    checkUserRole,
} = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.post('/auth/login', login);
    router.post(
        '/auth/logout',
        checkUserToken,
        checkUserRole(['admin']),
        logout
    );
};
