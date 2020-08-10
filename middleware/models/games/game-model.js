'use strict';

const schema = require('./game-schema');
const Model = require('../mongooseInterface');

class Games extends Model {
  constructor(){
    super(schema);
  }
}

module.exports = Games;