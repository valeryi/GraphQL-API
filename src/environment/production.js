import dotenv from 'dotenv';
dotenv.config();

export const production = {
  port: process.env.PORT,
  token_secret: process.env.TOKEN_SECRET,
  hash_rounds: process.env.HASH_ROUNDS,
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  log_level: 'error',
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
};
