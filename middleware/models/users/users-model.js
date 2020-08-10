'use strict';

const schema = require('./users-schema');
const Model = require('../mongooseInterface');

class Users extends Model {
  constructor(){
    super(schema);
  }
}

module.exports = Users;