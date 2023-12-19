const {
    getTransactionDetail,
    createTransaction,
    getAllTransaction,
} = require('../controllers/transactionController');
const { checkUserToken } = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.get('/transactions', checkUserToken, getAllTransaction);
    router.get('/transaction/:id', checkUserToken, getTransactionDetail);
    router.post('/transaction', checkUserToken, createTransaction);
};
