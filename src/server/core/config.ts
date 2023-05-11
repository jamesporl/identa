import { cleanEnv, str } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const config = cleanEnv(process.env, {
  JWT_AUTH_SECRET: str({ default: 'ChaNg3MePlea$e' }),
  JWT_EMAIL_VER_SECRET: str({ default: 'Chang3MePlea$e' }),
  MONGODB_URI: str({ default: 'mongodb://localhost:27017/trpc' }),
  NODE_ENV: str({ default: 'development' }),
});

export default config;
