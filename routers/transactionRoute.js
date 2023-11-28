const {
    getTransactionDetail,
    getUserTransaction,
} = require('../controllers/transactionController');

module.exports = (router) => {
    router.get('/transactions', getUserTransaction);
    router.get('/transaction/:id', getTransactionDetail);
};
