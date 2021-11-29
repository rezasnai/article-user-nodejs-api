const BaseModel = require('../database/BaseModel')

class UserModel extends BaseModel {
  constructor() {
    super('users', ['first_name', 'last_name', 'email', 'password'], 'email')
  }
}

const user = new UserModel()

module.exports = user
