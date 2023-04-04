import { model, Schema } from 'mongoose';
import { PostDraft } from './_types';

const PostDraftSchema = new Schema(
  {
    postId: { type: Schema.Types.ObjectId, required: true },
    title: String,
    jsonContent: { type: Schema.Types.Mixed },
    tagIds: [Schema.Types.ObjectId],
  },
  {
    collection: 'PostDraft', timestamps: true,
  },
);

const MPostDraft = model<PostDraft>('PostDraft', PostDraftSchema);

export default MPostDraft;
