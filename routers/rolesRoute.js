const {
    getAllRoles,
    getRoleById,
    deleteRoles,
    createRoles,
    updateRoles,
    getActiveRoles,
} = require('../controllers/rolesController');
const { checkUserToken } = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.get('/roles', checkUserToken, getAllRoles);
    router.get('/roles/active', checkUserToken, getActiveRoles);
    router.get('/roles/:id', checkUserToken, getRoleById);
    router.put('/roles/:id', checkUserToken, updateRoles);
    router.delete('/roles/:id', checkUserToken, deleteRoles);
    router.post('/roles', checkUserToken, createRoles);
};
