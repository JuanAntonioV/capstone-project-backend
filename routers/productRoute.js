const productController = require('../controllers/productController');

module.exports = (router) => {
    router.post('/product/', productController.create);
    router.get('/product/get', productController.getAll);
    router.get('/product/get/:id', productController.getById);
    router.put('/product/update/:id', productController.update);
    router.delete('/product/delete/:id', productController.delete);
};
