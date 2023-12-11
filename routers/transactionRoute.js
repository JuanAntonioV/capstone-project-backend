const {
    getTransactionDetail,
    getUserTransaction,
    // createTransaction,
} = require('../controllers/transactionController');

module.exports = (router) => {
    router.get('/transactions', getUserTransaction);
    router.get('/transaction/:id', getTransactionDetail);
    // router.post('/transaction', createTransaction);
};
