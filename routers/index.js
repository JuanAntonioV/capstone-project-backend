const { Router } = require('express');
const homeRoute = require('./homeRoute');
const userRoute = require('./userRoute');
const categoryRoute = require('./categoryRoute');

const router = Router();

module.exports = () => {
    homeRoute(router);
    userRoute(router);
    categoryRoute(router);
    return router;
};
