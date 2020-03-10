import { allow } from 'graphql-shield';

const isAuthorized = rule()(
  (obj, args, { authUser }, info) => authUser && true
);

export const permissions = {
  Query: {
    '*': isAuthorized,
    sayHello: allow
  },

  Mutation: {
    '*': isAuthorized,
    sayHello: allow
  }
}
