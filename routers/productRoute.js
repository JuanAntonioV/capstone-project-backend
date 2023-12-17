const productController = require('../controllers/productController');
const { uploads } = require('../utils/uploads');

module.exports = (router) => {
    router.post('/products', uploads.single('image'), productController.create);
    router.get('/products', productController.getAll);
    router.get('/products/:id', productController.getById);
    router.put(
        '/products/:id',
        uploads.single('image'),
        productController.update
    );
    router.delete('/products/:id', productController.delete);
};
