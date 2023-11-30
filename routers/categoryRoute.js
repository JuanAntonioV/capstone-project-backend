const { getActiveCategory, createCategory, getAllCategories, getCategoryById, updateCategoryById, deleteCategoryById } = require('../controllers/categoryController');

module.exports = (router) => {
    router.post('/categories', createCategory);
    router.get('/categories', getAllCategories);
    router.get('/categories/:id', getCategoryById);
    router.put('/categories/:id', updateCategoryById);
    router.delete('/categories/:id', deleteCategoryById);
};



