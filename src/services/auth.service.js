import BaseService from "./base.service";
import { compareSync } from "bcryptjs";
import { User } from "../models/user.model";
import { AuthenticationError, DBError, ValidationError } from '../utils/ErrorClasses/CustomErrors';
import { userService } from '../services/user.service';
import { sign } from "../utils/jwt";

class AuthService extends BaseService {

  constructor() {
    super(User)
  }

  async signIn(email, password) {
    const user = await this.findByEmail(email);

    if (!user) {
      throw new AuthenticationError(`User with this email doesn't exist: ${email}`, { errors: ['no such user'] })
    }

    if (!await compareSync(password, user.password)) {
      throw new AuthenticationError(`Wrong creadentials`, { errors: ['wrong password'] })
    }

    if (!user.confirmed) {
      throw new AuthenticationError(`Email address is not confirmed yet. First, confirm your email address!`, { errors: ['email not confirmed'] })
    }

    // TODO: Remove 'password' property from the object. delete user.password - doesn't work 
    user.password = null;

    const token = sign({ userData: user });

    return {
      success: true, message: 'Logged in successfully!', token
    };

  }

  async signUp(params) {

    // FIXME: This check if user exists is hardcoded twice. It would be more confortable to make it as a function
    // in case I need to change something so I don't need to change the same thing in two different places
    // this chech is in <Signup> and <CreateUser> Resolvers
    const user = await userService.findByEmail(params.email);

    if (user) {
      throw new AuthenticationError(`This user already exists in the database`, { errors: ['user already exists'] })
    }

    const created = await userService.createUser(params);
    await userService.sendConfirmLetter(created);

    return {
      success: true,
      message: 'User created successfully',
      created
    };
  }

  async confirm(id) {
    const user = await this.findById(id);

    if (!user) {
      throw new ValidationError(`Broken confirmation link: ${user.id}`);
    };

    if (user.confirmed) {
      throw new ValidationError(`Email address had already been confirmed`);
    }

    return await this.update(id, { confirmed: true })
      .then(updated => {
        // TODO: Set redirect after email confirmation
        return { message: `User with id "${updated._id}" is successfully updated`, success: true, updated };
      })
      .catch(err => {
        if (err) {
          throw new DBError(`Couldn't update ${{ confirmed: true }} for a user with id: ${id}`, { errors: err });
        }
      })
  }
}

export const authService = new AuthService();
