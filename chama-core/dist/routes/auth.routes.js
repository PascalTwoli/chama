"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRouter = (0, express_1.Router)();
authRouter.post('/sign-up', (req, res, next) => {
    res.send('Signed up successfully :)');
    next();
});
authRouter.post('/sign-in', (req, res, next) => {
    res.send({ title: 'Logged in successfully :)' });
    next();
});
authRouter.post('/sign-out', (req, res, next) => {
    res.send({ title: 'Logged out successfully :)' });
    next();
});
exports.default = authRouter;
