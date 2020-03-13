import { logger } from "../utils/logging";
import { DBError, UserError } from '../utils/ErrorClasses/CustomErrors';

export default class BaseService {

  constructor(model) {
    this.model = model;
  }

  findById(id) {

    return this.model.findById(id)
      .then(data => data)
      .catch(err => {
        if (err) {
          throw new DBError(err.message);
        }
      })

  }

  findByEmail(email) {
    return this.model.findOne({ email })
      .then(user => user)
      .catch(err => {
        throw new DBError(`Error occured trying to find user by email: ${err.message}`);
      })
  }

  findAll() {
    return this.model.find()
      .then(data => data)
      .catch(err => {
        throw new DBError(`Error occured trying to find users: ${err.message}`);
      })
  }

  findManyBy(param) {
    return this.model.find(param)
      .then(data => data)
      .catch(err => {
        if (err) {
          throw new DBError('Something went wrong while fetching data by params - findNamyBy');
        }
      })
  }

  update(id, data) {
    return this.model.findByIdAndUpdate(id, data)
      .then(updated => Object.assign(updated._doc, data))
      .catch(err => {
        throw new DBError(`Error occured trying to update: ${err}`);
      })
  }

  delete(id) {
    return this.model.findByIdAndDelete(id)
      .then(deleted => deleted)
      .catch(err => {
        logger.error(`Error occured trying to delete: ${id}: ${err.message}`);
        throw new DBError(`Error occured trying to delete ${id}: ${err.message}`);
      })
  }

  create(data) {

    return this.model.create(data)
      .then(created => created)
      .catch(err => {
        if (err) {
          throw new DBError(`Couldn't created new record to a database`)
        }
      })

  }

}
