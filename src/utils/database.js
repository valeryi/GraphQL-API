import mongoose from 'mongoose';
import { env } from "../environment";
import { logger } from './logging';

class Database {

  constructor() {

    this._provider = 'MongoDB';
    this._username = env.DB.USERNAME;
    this._password = env.DB.PASSWORD;
    this._dbName = env.DB.NAME;
    this.options = { useUnifiedTopology: true, useNewUrlParser: true, useFindAndModify: false };
    this.db = mongoose.connection;

  }

  init() {
    mongoose.Promise = global.Promise;

    const url = `mongodb+srv://${this._username}:${this._password}@cocoondb-qx9lu.mongodb.net/${this._dbName}?retryWrites=true&w=majority`;

    this.db.on('connecting', () => {
      // logger.info('Connecting to MongoDB...');
    });

    this.db.on('error', (err) => {
      logger.error(`Something went wrong trying to connect to the database: ${this._provider}: ` + err);
      mongoose.disconnect();
    });

    this.db.on('connected', () => {
      // logger.info('MongoDB connected!');
    });

    this.db.once('open', () => {
      logger.info(`Connection open`);
    });

    this.db.on('reconnected', () => {
      // logger.info('MongoDB reconnected!');
    });

    this.db.on('disconnected', () => {
      logger.error('MongoDB disconnected!');

      setTimeout(() => {
        this.connect(url);
      }, 5000);

    });

    this.connect(url);

  }

  connect(url) {
    mongoose.connect(url, this.options);
  }

}

export const database = new Database();

// TODO: Add monitoring of a connection state and informing certain people accordingly