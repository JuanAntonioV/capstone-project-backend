const { getActiveUser, createUser, getAllUsers, getUserById, updateUserById, deleteUserById } = require('../controllers/userController');

module.exports = (router) => {
    router.post('/users', createUser);
    router.get('/users/get', getAllUsers);
    router.get('/users/get/:id', getUserById);
    router.put('/users/update/:id', updateUserById);
    router.delete('/users/delete/:id', deleteUserById);
};
