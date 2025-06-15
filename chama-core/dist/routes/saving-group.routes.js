"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const savingGroupRouter = express_1.default.Router();
/* GET saving-group listing. */
savingGroupRouter.get('/', (req, res, next) => {
    res.send('Fetch all saving-group');
    next();
});
savingGroupRouter.get('/:id', function (req, res, next) {
    res.send('Fetch a single saving-group');
    next();
});
savingGroupRouter.post('/', function (req, res, next) {
    res.send('Create a saving-group');
    next();
});
savingGroupRouter.patch('/:id', function (req, res, next) {
    res.send('Update a saving-group');
    next();
});
savingGroupRouter.delete('/:id', function (req, res, next) {
    res.send('Delete a saving-group');
    next();
});
exports.default = savingGroupRouter;
