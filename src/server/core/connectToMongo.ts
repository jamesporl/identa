import mongoose from 'mongoose';

export default async function connectToMongo(): Promise<void> {
  mongoose.set('debug', process.env.NODE_ENV === 'development');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/trpc');
}
