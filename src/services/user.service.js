import { User } from "../models/user.model";
import BaseService from "./base.service";
import { compareSync, hashSync } from "bcryptjs";
import SimpleCrypto from 'simple-crypto-js';
import { env } from "../../environment";
import { logger } from "../utils/logging";
import { mailService } from '../services/mail.service';

const HASH_ROUNDS = parseInt(env.HASH_ROUNDS);

class UserService extends BaseService {

  constructor() {
    super(User);
  }

  async fetchAllUsers() {
    const users = await userService.findAll();

    if (users.success) {
      users.users = users.data;
      delete users.data;
      return users;
    }

    return {
      success: false,
      message: 'Problems with fetching all users'
    }

  }

  async fetchUser(id) {
    const user = await userService.findById(id);

    user.user = user.data;
    delete user.data;

    return user;
  }

  async findManyUsers(param) {
    const user = await this.findManyBy(param);

    user.users = user.data;
    delete user.data;
    return user;
  }

  async createUser(data) {
    data.password = await hashSync(data.password, HASH_ROUNDS);
    delete data.rePassword;

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
    const user = await this.delete(id);

    user.user = user.deleted;
    delete user.deleted;
    return user;
  }



  async updateUser(id, data) {
    const user = await this.update(id, data);

    user.user = user.updated;
    delete user.updated;
    return user;
  }
}

export const userService = new UserService();
