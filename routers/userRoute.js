const {
    getActiveUser,
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    activedUser,
} = require('../controllers/userController');
const { checkUserToken } = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.post('/users', checkUserToken, createUser);
    router.get('/users', checkUserToken, getAllUsers);
    router.get('/users/:id', checkUserToken, getUserById);
    router.put('/users/:id', checkUserToken, updateUserById);
    router.post('/users/active', checkUserToken, activedUser);
    router.delete('/users/:id', checkUserToken, deleteUserById);
};
