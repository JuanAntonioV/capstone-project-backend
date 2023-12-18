const {
    getActiveUser,
    createUser,
    getAllUsers,
    getUserById,
    updateUserById,
    deleteUserById,
    activedUser,
} = require('../controllers/userController');

module.exports = (router) => {
    router.post('/users', createUser);
    router.get('/users', getAllUsers);
    router.get('/users/:id', getUserById);
    router.put('/users/:id', updateUserById);
    router.post('/users/active', activedUser);
    router.delete('/users/:id', deleteUserById);
};
