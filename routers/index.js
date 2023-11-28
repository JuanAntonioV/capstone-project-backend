const { Router } = require('express');
const homeRoute = require('./homeRoute');
const userRoute = require('./userRoute');
const categoryRoute = require('./categoryRoute');
const transactionRoute = require('./transactionRoute');
const productRoute = require('./productRoute');

const router = Router();

module.exports = () => {
    homeRoute(router);
    userRoute(router);
    categoryRoute(router);
    transactionRoute(router);
    productRoute(router);
    return router;
};
