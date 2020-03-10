// import { isUserManager, isAuthorized } from '../../utils/shield';
import { allow } from 'graphql-shield';

export const permissions = {

  Mutation: {
    signIn: allow,
    signUp: allow
  }

};
