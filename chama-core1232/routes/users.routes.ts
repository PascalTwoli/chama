import express, { Request, Response, NextFunction } from 'express';
const userRouter = express.Router();

/* GET users listing. */
userRouter.get('/', (req: Request, res: Response, next: NextFunction) => {
  res.send('Fetch all users');
  next();
})

userRouter.get('/:id', function(req: Request, res: Response, next: NextFunction) {
  res.send('Fetch a single user');
  next();
})

userRouter.post('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('Create a user');
  next();
})
userRouter.patch('/:id', function(req: Request, res: Response, next: NextFunction) {
  res.send('Update a user');
  next();
})

userRouter.delete('/:id', function(req: Request, res: Response, next : NextFunction) {
  res.send('Delete a user');
  next();
})

export default userRouter;
