'use strict';
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, '__esModule', { value: true });
const express_1 = __importDefault(require('express'));
const userRouter = express_1.default.Router();
/* GET users listing. */
userRouter.get('/', (req, res, next) => {
  res.send('Fetch all users');
  next();
});
userRouter.get('/:id', function (req, res, next) {
  res.send('Fetch a single user');
  next();
});
userRouter.post('/', function (req, res, next) {
  res.send('Create a user');
  next();
});
userRouter.patch('/:id', function (req, res, next) {
  res.send('Update a user');
  next();
});
userRouter.delete('/:id', function (req, res, next) {
  res.send('Delete a user');
  next();
});
exports.default = userRouter;
