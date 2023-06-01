import { Request, Response } from 'express';
import { Types } from 'mongoose';
import sharp from 'sharp';
import { CompanyPermKey } from '../../../../base/db/_types';
import config from '../../../../../core/config';
import s3Config from '../../../../../core/files/s3Config';
import { MCompany } from '../../../../base/db';

export default async function updateCompanyLogo(req: Request, res: Response) {
  if (req.ctx) {
    const { companyId, ownsCompany, companyPerms } = req.ctx;
    if (companyId && (ownsCompany || (companyPerms || []).includes(CompanyPermKey.companyAdmin))) {
      const company = await MCompany.findOne({ _id: companyId });
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

        const imagePath = `${config.DO_SPACES_PATH_PREFIX}/${companyId}/company-logo/${imageId}.jpg`;

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

        if (company?.image) {
          const keyToDelete = company.image.replace(`${config.DO_SPACES_URL}/`, '');
          await s3Config.deleteObject(
            { Bucket: config.DO_SPACES_BUCKET, Key: keyToDelete },
          ).promise();
        }

        await MCompany.updateOne(
          { _id: companyId },
          { $set: { image: `${config.DO_SPACES_URL}/${imagePath}` } },
        );
        return res.sendStatus(200);
      }
    }
  }
  return res.sendStatus(400);
}
