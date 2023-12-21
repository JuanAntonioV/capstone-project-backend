const {
    getTransactionDetail,
    createTransaction,
    getAllTransaction,
    confirmTransaction,
    cancelTransaction,
    finishTransaction,
} = require('../controllers/transactionController');
const { checkUserToken } = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.get('/transactions', checkUserToken, getAllTransaction);
    router.get('/transaction/:id', checkUserToken, getTransactionDetail);
    router.post('/transaction', checkUserToken, createTransaction);
    router.post('/transaction/:id/confirm', checkUserToken, confirmTransaction);
    router.post('/transaction/:id/cancel', checkUserToken, cancelTransaction);
    router.post('/transaction/:id/finish', checkUserToken, finishTransaction);
};
