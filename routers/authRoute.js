const { login, logout, me } = require('../controllers/authController');
const {
    checkUserToken,
    checkUserRole,
} = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.post('/auth/login', login);
    router.post('/auth/logout', checkUserToken, logout);
    router.get('/auth/me', checkUserToken, me);
};
