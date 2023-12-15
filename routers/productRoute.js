const productController = require('../controllers/productController');

module.exports = (router) => {
    router.post('/products', productController.create);
    router.get('/products', productController.getAll);
    router.get('/products/:id', productController.getById);
    router.put('/products/:id', productController.update);
    router.delete('/products/:id', productController.delete);
};
