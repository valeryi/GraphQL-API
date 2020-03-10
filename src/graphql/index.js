import { readdirSync, readFileSync } from "fs";
import path from "path";
import { mergeTypes } from "merge-graphql-schemas";
import { makeExecutableSchema } from "graphql-tools";
import { applyMiddleware } from "graphql-middleware";
import { shield } from "graphql-shield";
import { ForbiddenError } from 'apollo-server-express';
import { merge } from "lodash";

class Explorer {

  constructor() {
    this._read = true;
    this._typeDefs = [];
    this._resolvers = [];
    this._permissions = [];
    this._validators = {};

    // defining folders where the parts are located
    this._schemaFolder = 'schemas';
    this._resolverFolder = 'resolvers';
    this._validatorFolder = 'validators';
    this._permissionFolder = 'permissions';
  }

  _getSchemas(directory) {
    const sf = readdirSync(path.join(directory, this._schemaFolder))
      .filter(schema => /(.graphql)$/i.test(schema))
      .map(name => this._readFile(path.join(directory, this._schemaFolder, name)))
      .map((schema) => schema.replace(/extend *type/g, 'type'));
    const merged = mergeTypes(sf);
    const schemaFiles = merged.replace(/_empty: *String/g, '')
    return schemaFiles;
  }

  _readFile(path, encoding = 'utf8') {
    return readFileSync(path, encoding, res => res);
  }

  _getResolvers(directory) {

    const resolverExp = /^\w+(\.resolvers\.)(js)$/i;
    const resolverList = readdirSync(path.join(directory, this._resolverFolder));
    // Filtering resolvers by names
    const foundResolvers = resolverList.filter(file => resolverExp.test(file));
    // Requiring resolvers
    const r = foundResolvers.map(name => require(path.join(directory, this._resolverFolder, name)));
    // Reformating the structure of required resolvers
    const resolverName = r.map(object => Object.keys(object)[0]);
    const resolvers = r.map((value, index) => value[resolverName[index]]);

    return resolvers;
  }

  _getPermissions(directory) {
    const list = readdirSync(path.join(directory, this._permissionFolder));
    const required = list.map(file => require(path.join(directory, this._permissionFolder, file)));
    const permissions = [];
    required.map(permission => merge(permissions, permission));

    return permissions['permissions'];
  }

  _getValidators(directory) {
    const list = readdirSync(path.join(directory, this._validatorFolder));
    const required = list.map(file => require(path.join(directory, this._validatorFolder, file)));
    const validators = [];
    required.map(validator => merge(validators, validator));

    return validators['validators'];
  }

  _scan() {
    this._typeDefs = this._getSchemas(__dirname);
    this._resolvers = this._getResolvers(__dirname);
    this._permissions = this._getPermissions(__dirname);
    this._validators = this._getValidators(__dirname);
  }

  async getSchema() {

    if (this._read) {
      await this._scan();
      this._read = false;
    }

    const schema = makeExecutableSchema({ typeDefs: this._typeDefs, resolvers: this._resolvers });

    return applyMiddleware(
      schema,
      this._validators,
      shield(this._permissions, {
        allowExternalErrors: true,
        fallbackError: new ForbiddenError('Don\'t have permissions for this data!')
      }));
  }
}

export const apiExplorer = new Explorer();
