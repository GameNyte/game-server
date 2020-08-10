'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
    boardName: {
      type: String,
      default: 'none',
      required: 'true'
    },
    boardData: {
      type:String
    },
    gameName: {type: String}

})

module.exports = mongoose.model('games', schema);