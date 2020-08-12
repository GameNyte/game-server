'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  username: {type:String, require:true},
  email: {type:String, require:false},
  password: {type:String, require:true},
  role: {type:String, require:false}

})

module.exports = mongoose.model('users', schema);