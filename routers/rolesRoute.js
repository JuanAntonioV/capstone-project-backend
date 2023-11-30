const {
    getAllRoles,
    getRoleById,
    deleteRoles,
    createRoles,
    updateRoles,
    getActiveRoles,
} = require('../controllers/rolesController');

module.exports = (router) => {
    router.get('/roles', getAllRoles);
    router.get('/roles/active', getActiveRoles);
    router.get('/roles/:id', getRoleById);
    router.put('/roles/:id', updateRoles);
    router.delete('/roles/:id', deleteRoles);
    router.post('/roles', createRoles);
};
