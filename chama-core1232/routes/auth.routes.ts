import { Router, Request, Response, NextFunction  } from 'express';

const authRouter: Router = Router();

authRouter.post('/sign-up', (req: Request, res: Response, next: NextFunction) => {
  res.send('Signed up successfully :)');
  next();
})

authRouter.post('/sign-in', (req: Request, res: Response, next: NextFunction) => {
  res.send({title: 'Logged in successfully :)'});
  next();
})

authRouter.post('/sign-out', (req: Request, res: Response, next: NextFunction) => {
  res.send({title: 'Logged out successfully :)'});
  next();
})
export default authRouter;