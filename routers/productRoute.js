const productController = require('../controllers/productController');
const { checkUserToken } = require('../middlewares/authMiddleware');
const { uploads } = require('../utils/uploads');

module.exports = (router) => {
    router.post(
        '/products',
        checkUserToken,
        uploads.single('image'),
        productController.create
    );
    router.get('/products', checkUserToken, productController.getAll);
    router.get('/products/:id', checkUserToken, productController.getById);
    router.put(
        '/products/:id',
        checkUserToken,
        uploads.single('image'),
        productController.update
    );
    router.delete('/products/:id', checkUserToken, productController.delete);
};
