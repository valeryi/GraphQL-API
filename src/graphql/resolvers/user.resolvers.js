import { userService } from "../../services/user.service";
import { UserInputError, ApolloError } from 'apollo-server-express';

export const UserResolvers = {
  Query: {

    allUsers: async (obj, args, context, info) => {
      return await userService.fetchAllUsers();
    },
    userById: async (obj, { id }, context, info) => {
      return await userService.fetchUser(id);
    },
    findManyUsers: async (obj, { param }, context, info) => {
      return await userService.findManyUsers(param);
    }
  },

  Mutation: {

    createUser: async (obj, { data }, context, info) => {

      const user = await userService.findByEmail(data.email);

      if (user.success) {
        user.success = false;
        user.user = null;
        user.errors = ['already exists'];
        return user;
      }

      data.confirmed = true;
      return userService.createUser(data).then(created => {
        return created;
      });
    },

    deleteUser: async (obj, { id }, context, info) => {
      return await userService.deleteUser(id);
    },

    updateUser: (obj, { id, update }, context, info) => {
      return userService.updateUser(id, update);
    }
  }
}



