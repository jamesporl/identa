import express, { Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { createContext } from '../trpc';
import updateMyCompanyAccountImage from '../../mods/base/api/uploads/updateMyCompanyAccountImage';
import updateCompanyLogo from '../../mods/practice/admin/api/uploads/updateCompanyLogo';

const multerInstance = multer();

const uploadsRouter = express.Router();

function authenticate(req: Request, res: Response, next: NextFunction) {
  const authCtx = createContext({ req, res });
  if (!authCtx.accountId) {
    res.sendStatus(400);
  }
  req.ctx = authCtx;
  next();
}

uploadsRouter.use(express.json());

uploadsRouter.post(
  '/updateCompanyLogo',
  authenticate,
  multerInstance.single('file'),
  updateCompanyLogo,
);

uploadsRouter.post(
  '/updateMyCompanyAccountImage',
  authenticate,
  multerInstance.single('file'),
  updateMyCompanyAccountImage,
);

export default uploadsRouter;
