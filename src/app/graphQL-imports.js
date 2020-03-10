import path from "path";
import fs from "fs";
import { fileLoader, mergeTypes } from 'merge-graphql-schemas';

export function getGraphQlFiles() {

  // Provide the path to folders with files from the ROOT directory
  const schemaFolder = 'graphql/schemas';
  const resolverFolder = 'graphql/resolvers';

  // Combining the path to the folders
  const schemaDirectory = path.join(process.cwd(), schemaFolder);
  const resolverDirectory = path.join(process.cwd(), resolverFolder);

  // Checking directories for files
  const schemaList = fs.readdirSync(schemaDirectory);
  const resolverList = fs.readdirSync(resolverDirectory);


  const resolvers = getResolvers();
  const schemas = getSchemas();

  return {
    schemas,
    resolvers
  }


  function getResolvers() {

    const resolverExp = /^\w+(\.resolvers\.)(js)$/i;

    // Filtering resolvers by names
    const foundResolvers = resolverList.filter(file => resolverExp.test(file));

    // Requiring resolvers
    const r = foundResolvers.map(name => require(path.join(resolverDirectory, name)));

    // Reformating the structure of required resolvers
    const resolverName = r.map(object => Object.keys(object)[0]);
    const resolvers = r.map((value, index) => value[resolverName[index]]);

    return resolvers;
  }

  function getSchemas() {

    const schemaExp = /^\w+(\.api\.)(graphql)$/i;

    const foundSchemas = schemaList.filter(file => schemaExp.test(file));

    // Loading schemas
    const schemas = foundSchemas.map(name => fileLoader(path.join(schemaDirectory, name)));

    // Replacing "extend type" in extending schemas with "type"
    const withoutExtend = schemas.map((schema) => schema[0].replace(/extend *type/g, 'type'));

    const merged = mergeTypes(withoutExtend);

    // Deleting empty root definition
    const withoutEmpty = merged.replace(/_empty: *String/g, '');

    return withoutEmpty;
  }
}

