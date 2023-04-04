import { model, Schema } from 'mongoose';
import { PostTag } from './_types';

const PostTagSchema = new Schema(
  {
    name: {
      type: String, required: true, unique: true,
    },
    slug: {
      type: String, required: true, unique: true,
    },
  },
  {
    collection: 'PostTag',
  },
);

PostTagSchema.index({ name: 1 });
PostTagSchema.index({ slug: 1 });

const MPostTag = model<PostTag>('PostTag', PostTagSchema);

export default MPostTag;
