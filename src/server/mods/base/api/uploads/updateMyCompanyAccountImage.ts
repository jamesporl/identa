import { Request, Response } from 'express';
import { Types } from 'mongoose';
import sharp from 'sharp';
import config from '../../../../core/config';
import s3Config from '../../../../core/files/s3Config';
import { MAccount, MAccountCompanyLink } from '../../db';

// todo: improve error handling here
export default async function updateMyCompanyAccountImage(req: Request, res: Response) {
  if (req.ctx) {
    const { companyId, accountId } = req.ctx;
    if (companyId) {
      const companyLink = await MAccountCompanyLink.findOne({ companyId, accountId });
      if (!companyLink) {
        return res.sendStatus(500);
      }
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

        const imagePath = `${config.DO_SPACES_PATH_PREFIX}/${companyId}/profile-photo/${accountId}/${imageId}.jpg`;

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

        if (companyLink.image) {
          const keyToDelete = companyLink.image.replace(`${config.DO_SPACES_URL}/`, '');
          await s3Config.deleteObject(
            { Bucket: config.DO_SPACES_BUCKET, Key: keyToDelete },
          ).promise();
        }

        await MAccountCompanyLink.updateOne(
          { _id: companyLink._id },
          { $set: { image: `${config.DO_SPACES_URL}/${imagePath}` } },
        );

        await MAccount.updateOne(
          { _id: accountId },
          { $set: { image: `${config.DO_SPACES_URL}/${imagePath}` } },
        );
        return res.sendStatus(200);
      }
    }
  }
  return res.sendStatus(400);
}
