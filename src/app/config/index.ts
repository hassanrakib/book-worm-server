import dotenv from 'dotenv';
import path from 'path';

// config will read your .env to assign the contents to the process.env
dotenv.config({ path: path.join(process.cwd(), '.env') });

// export all environment variables
export default {
  NODE_ENV: process.env.NODE_ENV,
  cors_origin: process.env.CORS_ORIGIN,
  port: process.env.PORT,
  db_user: process.env.DB_USER,
  db_password: process.env.DB_PASSWORD,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  jwt_secret: process.env.JWT_SECRET,
  jwt_expires_in: process.env.JWT_EXPIRES_IN,
  admin_email: process.env.ADMIN_EMAIL,
  admin_password: process.env.ADMIN_PASSWORD,
};