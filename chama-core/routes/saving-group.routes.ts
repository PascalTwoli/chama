import express, { Request, Response, NextFunction } from 'express';

const savingGroupRouter = express.Router();
/* GET saving-group listing. */
savingGroupRouter.get(
  '/',
  (req: Request, res: Response, next: NextFunction) => {
    res.send('Fetch all saving-group');
    next();
  },
);
savingGroupRouter.get(
  '/:id',
  function (req: Request, res: Response, next: NextFunction) {
    res.send('Fetch a single saving-group');
    next();
  },
);

savingGroupRouter.post(
  '/',
  function (req: Request, res: Response, next: NextFunction) {
    res.send('Create a saving-group');
    next();
  },
);

savingGroupRouter.patch(
  '/:id',
  function (req: Request, res: Response, next: NextFunction) {
    res.send('Update a saving-group');
    next();
  },
);
savingGroupRouter.delete(
  '/:id',
  function (req: Request, res: Response, next: NextFunction) {
    res.send('Delete a saving-group');
    next();
  },
);

export default savingGroupRouter;
