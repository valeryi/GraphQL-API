import dotenv from 'dotenv';
dotenv.config();

export const development = {
  port: process.env.PORT || 3000,
  db: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME,
  },
  token_secret: process.env.TOKEN_SECRET,
  hash_rounds: process.env.HASH_ROUNDS,
  log_level: 'info',
  mail: {
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: process.env.MAIL_SECURE,
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
};
