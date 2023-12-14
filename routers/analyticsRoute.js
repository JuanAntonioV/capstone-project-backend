const { getDashboardStats } = require('../controllers/analyticsController');

module.exports = (router) => {
    router.get('/stats', getDashboardStats);
};
