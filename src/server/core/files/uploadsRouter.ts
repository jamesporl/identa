import express, { Request, Response, NextFunction } from 'express';
import { Types } from 'mongoose';
import sharp from 'sharp';
import multer from 'multer';
import { MCompany } from '../../mods/base/db';
import { createContext } from '../trpc';
import config from '../config';
import s3Config from './s3Config';

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
  async (req, res) => {
    if (req.ctx) {
      const { companyId, ownsCompany } = req.ctx;
      if (companyId && ownsCompany) {
        if (req.file) {
          const pipeline = sharp(req.file.buffer)
            .resize(512, 512, {
              fit: 'cover',
              background: {
                r: 0,
                g: 0,
                b: 0,
                alpha: 0,
              },
            })
            .flatten({
              background: '#ffffff',
            })
            .jpeg();

          const imageId = new Types.ObjectId();

          const imagePath = `${config.DO_SPACES_PATH_PREFIX}/company-logo/${companyId}/${imageId}.jpg`;

          await s3Config
            .putObject({
              Bucket: config.DO_SPACES_BUCKET,
              Key: imagePath,
              Body: await pipeline.toBuffer(),
              ACL: 'public-read',
              ContentDisposition: 'inline',
              ContentType: 'image/jpeg',
            })
            .promise();

          await MCompany.updateOne(
            { _id: companyId },
            { $set: { image: `${config.DO_SPACES_URL}/${imagePath}` } },
          );
          return res.sendStatus(200);
        }
      }
    }
    return res.sendStatus(400);
  },
);

export default uploadsRouter;
