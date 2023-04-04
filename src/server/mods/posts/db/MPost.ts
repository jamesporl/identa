import { model, Schema } from 'mongoose';
import { Post } from './_types';

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true },
    jsonContent: { type: Schema.Types.Mixed },
    htmlContent: { type: String },
    textContent: { type: String },
    tagIds: [Schema.Types.ObjectId],
    authorId: { type: Schema.Types.ObjectId },
    publishedAt: { type: Date },
  },
  {
    collection: 'Post', timestamps: true,
  },
);

PostSchema.index({ slug: 1 });

const MPost = model<Post>('Post', PostSchema);

export default MPost;
