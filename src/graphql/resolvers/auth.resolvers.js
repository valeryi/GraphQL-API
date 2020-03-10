import { userService } from "../../services/user.service";
import { authService } from "../../services/auth.service";

export const AuthResolvers = {
  Query: {

    authUser: (obj, args, { authUser }, info) => {
      return userService.findById(authUser.id)
        .then(user => {
          return user.user;
        });
    }
  },

  Mutation: {

    signIn: async (obj, { email, password }, context, info) => {

      return await authService.signIn(email, password);

    },

    signUp: async (obj, { SignUpInput }, context, info) => {

      console.log(SignUpInput)

      return await authService.signUp(SignUpInput);

    },

    // updatePersonalInfo: (obj, { fistname }, { authUser }, info) => {
    //   console.log(authUser);
    //   return userService.updateUser(authUser.id, {
    //     fistname
    //   });
    // },

    // changePassword: (obj, { password, newPassword, reNewPassword }, { authUser }, info) => {
    //   return userService.changePassword(authUser.id, password, newPassword);
    // }
  }
}

