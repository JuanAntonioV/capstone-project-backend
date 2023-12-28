const {
    getDashboardStats,
    getExportSales,
} = require('../controllers/analyticsController');
const { checkUserToken } = require('../middlewares/authMiddleware');

module.exports = (router) => {
    router.get('/stats', checkUserToken, getDashboardStats);
    router.get('/export-sales', checkUserToken, getExportSales);
};
