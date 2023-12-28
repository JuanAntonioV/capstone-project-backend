const { Router } = require('express');
const homeRoute = require('./homeRoute');
const userRoute = require('./userRoute');
const categoryRoute = require('./categoryRoute');
const transactionRoute = require('./transactionRoute');
const productRoute = require('./productRoute');
const rolesRoute = require('./rolesRoute');
const authRoute = require('./authRoute');
const analiticsRoute = require('./analyticsRoute');

const router = Router();

module.exports = () => {
    homeRoute(router);
    authRoute(router);
    userRoute(router);
    categoryRoute(router);
    transactionRoute(router);
    productRoute(router);
    rolesRoute(router);
    analiticsRoute(router);
    return router;
};
