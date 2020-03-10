import { readdirSync } from 'fs';
import path from "path";
import { logger } from '../utils/logging';
import { merge } from "lodash";

let mode;
let sourceFolder;

switch (true) {
  case (!process.env.NODE_ENV || process.env.NODE_ENV === 'development'): {

    mode = 'development';
    sourceFolder = 'src';
    break;

  }
  case process.env.NODE_ENV === 'production': {

    mode = 'production';
    sourceFolder = 'src';
    break;

  }


  default: {

    mode = process.env.NODE_ENV;
    sourceFolder = 'src';
    logger.warn(`Scenario for ${mode} mode is not setup: source folder is ${sourceFolder}`);
    break;

  }
}

const moduleFolder = 'environment';
const dirFiles = readdirSync(path.join(process.cwd(), sourceFolder, moduleFolder));
const envModeFiles = dirFiles.filter(fileName => !(/(^index.)/i.test(fileName)));
let currentMode;
let params = {};

envModeFiles.map(fileName => {
  const modeName = fileName.split('.')[0];
  const modeFile = require(path.join(process.cwd(), sourceFolder, moduleFolder, fileName))[modeName];
  merge(params, modeFile);

  if (modeName === mode) {
    currentMode = modeFile;
  }

});

function looping(obj, values) {
  const collection = {};

  for (const key in obj) {

    if (obj.hasOwnProperty(key)) {

      if (typeof obj[key] !== 'object') {

        try {
          if (values.hasOwnProperty(key)) {

            // By a recursive function run through all parameters,
            // transforming the keys to uppercased,
            // assigning value to 'obj' (file containing all the parameters)
            // from the current mode
            collection[key.toUpperCase()] = values[key];
          } else {

            // if there is no such a key in the current mode,
            // 'null' is assigned
            logger.warn(` Missing parameter "${key.toUpperCase()}" in ${mode} mode! | location: ${__filename.replace(process.cwd(), '')}`);
            collection[key.toUpperCase()] = null;
          }
        } catch (e) {
          logger.warn(` Missing parameter "${key.toUpperCase()}" in ${mode} mode! | location: ${__filename.replace(process.cwd(), '')}`);
        }

      } else {

        // Recursing through the object and the nested objects
        collection[key.toUpperCase()] = looping(obj[key], values[key]);
      }
    }
  }
  return collection;
}

export const env = looping(params, currentMode);

// TODO: Rewrite this function into a class Environment to keep it organized and implement ES6 standart

// FIXME: Function returns a Promise with the data.
// It's not comfortable and seem a bad practice - too much code for a simple task,
// and deal with a promise what may outcome in decreasing perfomance
// ( The simplest code, the fastest code )