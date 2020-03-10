import { isUserManager, isAuthorized } from './shield_rules';
import { allow, deny } from 'graphql-shield';

export const permissions = {

  Query: {
    // user: isAuthorized,
    // users: isAuthorized
  },
  Mutation: {
    createUser: allow
  }

};
