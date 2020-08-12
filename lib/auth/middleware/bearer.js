'use strict';

async function bearer (req, res, next) {
  // check auth headers
  if(!req.headers.authorization) {
    res.status(401).send('No Auth headers present');

  } else {
    //split the type from the token, and this is shorthand to do both in one line
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