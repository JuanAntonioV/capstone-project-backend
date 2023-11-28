const productController = require('../controllers/productController');

module.exports = (router) => {
    router.post('/product', productController.create);
    router.get('/product', productController.getAll);
    router.get('/product/:id', productController.getById);
    router.put('/product/:id', productController.update);
    router.delete('/product/:id', productController.delete);
};
