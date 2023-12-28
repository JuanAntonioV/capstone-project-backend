const {
    getActiveCategory,
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
} = require('../controllers/categoryController');
const { checkUserToken } = require('../middlewares/authMiddleware');
const { uploads } = require('../utils/uploads');

module.exports = (router) => {
    router.post(
        '/categories',
        checkUserToken,
        uploads.single('image'),
        createCategory
    );
    router.get('/categories', checkUserToken, getAllCategories);
    router.get('/categories/:id', checkUserToken, getCategoryById);
    router.put(
        '/categories/:id',
        checkUserToken,
        uploads.single('image'),
        updateCategoryById
    );
    router.delete('/categories/:id', checkUserToken, deleteCategoryById);
};
