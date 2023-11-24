const { Router } = require('express');
const homeRoute = require('./homeRoute');

const router = Router();

module.exports = () => {
    homeRoute(router);
    return router;
};
