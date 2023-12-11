const {
    getTransactionDetail,
    getUserTransaction,
    createTransaction,
} = require('../controllers/transactionController');
const { checkUserToken } = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.get('/transactions', checkUserToken, getUserTransaction);
    router.get('/transaction/:id', checkUserToken, getTransactionDetail);
    router.post('/transaction', checkUserToken, createTransaction);
};
