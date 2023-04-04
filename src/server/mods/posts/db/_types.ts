import { Document, Types } from 'mongoose';

export interface PostTag extends Document {
  name: string;
  slug: string;
}

export interface PostDraft extends Document {
  postId: Types.ObjectId;
  title: string;
  jsonContent: unknown;
  tagIds?: Types.ObjectId[];
}

export enum AppStatus {
  draft = 'draft',
  published = 'published',
  deleted = 'deleted',
}

export interface Post extends Document {
  title: Types.ObjectId;
  slug: string;
  jsonContent: unknown;
  htmlContent: string;
  textContent: string;
  authorId: unknown;
  publishedAt: Date;
  status: AppStatus;
}
