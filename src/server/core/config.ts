import { cleanEnv, str, url } from 'envalid';
import dotenv from 'dotenv';

dotenv.config();

const config = cleanEnv(process.env, {
  DO_SPACES_BUCKET: str({ default: 'techhustlers' }),
  DO_SPACES_ENDPOINT: str({ default: 'sgp1.digitaloceanspaces.com' }),
  DO_SPACES_KEY: str({ default: 'CHANGE_ME' }),
  DO_SPACES_SECRET: str({ default: 'CHANGE_ME' }),
  DO_SPACES_URL: url({ default: 'https://identa.sgp1.digitaloceanspaces.com' }),
  DO_SPACES_PATH_PREFIX: str({ default: 'dev' }),
  JWT_AUTH_SECRET: str({ default: 'ChaNg3MePlea$e' }),
  JWT_EMAIL_VER_SECRET: str({ default: 'Chang3MePlea$e' }),
  MONGODB_URI: str({ default: 'mongodb://localhost:27017/trpc' }),
  NODE_ENV: str({ default: 'development' }),
});

export default config;
