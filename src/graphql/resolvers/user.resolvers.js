import { userService } from "../../services/user.service";
import { UserError } from '../../utils/ErrorClasses/CustomErrors';

export const UserResolvers = {
  Query: {

    allUsers: async (obj, args, context, info) => {
      return await userService.fetchAllUsers();
    },
    fetchUser: async (obj, { id }, context, info) => {
      return await userService.fetchUser(id);
    },
    // findManyUsers: async (obj, { param }, context, info) => {
    //   return await userService.findManyUsers(param);
    // }
  },

  Mutation: {

    createUser: async (obj, { data }, context, info) => {

      const user = await userService.findByEmail(data.email);

      if (user) {
        throw new UserError('User already exists')
      }

      data.confirmed = true;

      return userService.createUser(data).then(created => {
        return created;
      });
    },

    deleteUser: async (obj, { id }, context, info) => {
      return await userService.deleteUser(id);
    },

    updateUser: (obj, { data }, context, info) => {
      return userService.updateUser(data.id, data.update);
    }
  }
}



