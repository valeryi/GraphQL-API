import { User } from "../models/user.model";
import BaseService from "./base.service";
import { compareSync, hashSync } from "bcryptjs";
import SimpleCrypto from 'simple-crypto-js';
import { env } from "../environment";
import { logger } from "../utils/logging";
import { mailService } from '../services/mail.service';
import { UserError } from '../utils/ErrorClasses/CustomErrors';

const HASH_ROUNDS = parseInt(env.HASH_ROUNDS);

class UserService extends BaseService {

  constructor() {
    super(User);
  }

  async fetchAllUsers() {
    const users = await userService.findAll();



    users.forEach(user => {

      // TODO: Remove password properties not just assign 'null'. - "delete user.password" doesn't work
      user.password = null;

    });

    return users;

  }

  async fetchUser(id) {
    const user = await userService.findById(id);
    console.log(user);

    // TODO: Remove password properties not just assign 'null'. - "delete user.password" doesn't work
    user.password = null;
    return user;
  }

  // async findManyUsers(param) {
  //   const user = await this.findManyBy(param);

  //   user.users = user.data;
  //   delete user.data;
  //   return user;
  // }

  async createUser(data) {
    data.password = await hashSync(data.password, HASH_ROUNDS);
    data.confirm = null;

    data.role = data.role || 'Student';

    return await this.create(data);

  }

  sendConfirmLetter(user) {

    const crypter = new SimpleCrypto(env.TOKEN_SECRET);
    const encrypt = crypter.encrypt(user.id);

    const template = {
      name: 'signup',
      data: {
        encrypt
      }
    }

    mailService.sendEmail(user.email, 'Confirmation', template);
  }

  async deleteUser(id) {
    const u = await this.findById(id);

    if (!u) {
      throw new UserError('No user with id: ' + id);
    }

    const user = await this.delete(id);

    if (user) {

      user.deleted = null;

    }

    return user;
  }



  async updateUser(id, data) {
    const u = await this.findById(id);

    if (!u) {
      throw new UserError('No user with id: ' + id);
    }


    const r = await this.update(id, data);
    return r;

  }
}

export const userService = new UserService();
