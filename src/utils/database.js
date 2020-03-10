import mongoose from 'mongoose';
import { env } from "../environment";
import { logger } from './logging';

class Database {

  constructor() {

    this._provider = 'MongoDB';
    // this._username = env.DB.USERNAME;
    // this._password = env.DB.PASSWORD;
    // this._dbName = env.DB.NAME;

    this._username = env.db.username;
    this._password = env.db.password;
    this._dbName = env.db.name;

  }

  init() {
    mongoose.Promise = global.Promise;

    const url = `mongodb+srv://${this._username}:${this._password}@cocoondb-qx9lu.mongodb.net/${this._dbName}?retryWrites=true&w=majority`;

    try {
      mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true, 'useFindAndModify': false }, (err) => {
        if (err) logger.error(err.message);
      });
      mongoose.connection.once('open', () => logger.info(`Connected to ${this._provider}`));
    } catch (e) {
      logger.error(`Something went wrong trying to connect to the database: ${this._provider}`);
    }
  }
}

export const database = new Database();
