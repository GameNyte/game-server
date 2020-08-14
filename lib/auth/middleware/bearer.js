'use strict';

const users = require('../../../middleware/models/users/users-model.js');

async function bearer (req, res, next) {
  
  if(!req.headers.authorization) {
    res.status(401).send('No Auth headers present');

  } else {

    let [authType, token] = req.headers.authorization.split(' ');
  
    let validUser = await users.validateToken(token);
  
    if (validUser) {
      req.user = validUser;
      next();
    } else {
      res.status(401).send('Invalid Token - bearer auth');
    }
  }
}

module.exports = bearer;