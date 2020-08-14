'use strict';

const schema = require('./users-schema');
const Model = require('../mongooseInterface');

const SECRET = process.env.SECRET;

class Users extends Model {
  constructor(){
    super(schema);
  }

  static async validateToken(token) {
    try {
      let user = await jwt.verify(token, SECRET);
      return user;
    } catch (e) {
      return Promise.reject('jwt Invalid - at validateToken');
    }
  }

}

module.exports = Users;