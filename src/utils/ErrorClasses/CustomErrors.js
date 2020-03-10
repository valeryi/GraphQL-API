import { ApolloError } from 'apollo-server-express';


export class ValidationError extends ApolloError {

  constructor(message, properties) {
    super(message, 'VALIDATION_ERROR', properties);
  }
}

export class AuthenticationError extends ApolloError {

  constructor(message, properties) {
    super(message, 'UNAUTHENTICATED', properties);
  }
}

export class DBError extends ApolloError {

  constructor(message, properties) {
    super(message, 'DATABASE_ERROR', properties);
  }
}
