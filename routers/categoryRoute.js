const {
    getActiveCategory,
    createCategory,
    getAllCategories,
    getCategoryById,
    updateCategoryById,
    deleteCategoryById,
} = require('../controllers/categoryController');
const { uploads } = require('../utils/uploads');

module.exports = (router) => {
    router.post('/categories', uploads.single('image'), createCategory);
    router.get('/categories', getAllCategories);
    router.get('/categories/:id', getCategoryById);
    router.put('/categories/:id', uploads.single('image'), updateCategoryById);
    router.delete('/categories/:id', deleteCategoryById);
};
