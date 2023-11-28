const { Router } = require('express');
const homeRoute = require('./homeRoute');
const userRoute = require('./userRoute');

const router = Router();

module.exports = () => {
    homeRoute(router);
    userRoute(router);
    return router;
};
