// import { UserInputError } from 'apollo-server-express';
import { AuthenticationError, ValidationError } from '../../utils/ErrorClasses/CustomErrors';
import PasswordValidator from 'password-validator';
import { isEmail } from 'validator';
import * as _ from 'lodash';

const passwordCheck = new PasswordValidator()
  .is().min(2)
  .is().max(20)
  .has().letters()
  .has().digits()
  .has().symbols()
  .has().not().spaces();

let errorList = [];

export const validators = {

  Mutation: {

    signIn: (resolve, obj, args, context) => {
      const { email } = args;

      if (!isEmail(email)) {
        throw new ValidationError('Wrong email format...', { errros: ['Invalid email format'] });
      }

      return resolve(obj, args, context);
    },

    signUp: (resolve, obj, args, context) => {
      // console.log(args.SignUpInput.email);
      const { email, password, confirm } = args.SignUpInput;

      if (!isEmail(email)) {
        errorList.push('Invalid email')
      }

      if (password !== confirm) {
        errorList.push('match')
      }

      const validation_errors = passwordCheck.validate(password, { list: true });

      if (validation_errors) {
        errorList.push(...validation_errors);
      }

      if (!_.isEmpty(errorList)) {

        const errors = [...errorList];

        // FIXME: fields are being accmulated with each new request so I have to manually clear up the array of errors
        errorList = [];

        // TODO: <Improve> format my Error object. Include bad fields in data, at lease...
        // throw new UserInputError('Something went wrong...', errors); // --- Tried to throw Errors - not giving me that flexibility
        // return {
        //   success: false,
        //   message: 'Something went wrong...',
        //   user: null,
        //   errors: errors
        // }

        throw new ValidationError('Validation Error', { errors });
      }

      return resolve(obj, args, context);
    },

    // changePassword: (resolve, obj, args, context) => {
    //   const { newPassword, reNewPassword } = args;

    //   if (newPassword !== reNewPassword) {
    //     throw new UserInputError('Passwords don\'t match!');
    //   }

    //   if (!passwordSchema.validate(newPassword)) {
    //     throw new UserInputError('Password is not strong enough!');
    //   }

    //   return resolve(obj, args, context);
    // }
  }
};
