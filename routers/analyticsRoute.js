const {
    getDashboardStats,
    getExportSales,
} = require('../controllers/analyticsController');

module.exports = (router) => {
    router.get('/stats', getDashboardStats);
    router.get('/export-sales', getExportSales);
};
