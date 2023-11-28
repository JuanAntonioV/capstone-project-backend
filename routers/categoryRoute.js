const { getActiveCategories } = require('../controllers/categoryController');

module.exports = (router) => {
    router.get('/category/active', getActiveCategories);
};
