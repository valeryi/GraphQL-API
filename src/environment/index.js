import { readdirSync } from 'fs';
import path from "path";
import { logger } from '../src/utils/logging';
import { merge } from "lodash";

// FIXME: Function returns a Promise with the data.
// It's not comfortable and seem a bad practice - too much code for a simple task,
// and deal with a promise what may outcome in decreasing perfomance
// ( The simplest code, the fastest code )
export const env = getEnvironment();

// TODO: Rewrite this function into a class Environment to keep it organized and implement ES6 standart
function getEnvironment() {
  const mode = process.env.NODE_ENV || 'development';
  const rootPath = process.cwd();
  const folder = 'environment';

  const loadEnvironments = () => {

    // Getting the list of available environments in the "environment" folder,
    // at the same time excluding index.js file
    const list = readdirSync(path.join(rootPath, folder)).filter(file => !/(?=^(index.js))/i.test(file));
    const parameters = {};

    // Loading the files found in the folder,
    // merging them with the help of a "lodash" library
    // just to get one common Object with all possible parameters from all found environments
    const loaded = list.map(fileName => {
      let name = fileName.split('.')[0];
      let loadedFile = require(path.join(rootPath, folder, fileName));
      const file = loadedFile[name];
      merge(parameters, { ...file });
      return loadedFile;
    });

    // Picking the currect mode out of already loaded ones
    const current = { ...loaded.filter(file => file[mode]).map(file => file[mode])[0] };

    // Returning an object with all parameters
    return {
      parameters,
      current
    }
  };

  const environments = loadEnvironments();

  const environment = {} = looping(environments.parameters, environments.current);


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

  // When parameters are ready,
  // the current mode is assigned
  environment["MODE"] = mode;

  return environment;
}

