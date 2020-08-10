'use strict';


const UsersModel = require('../middleware/models/users/users-model');

const GamesModel = require('../middleware/models/games/game-model');


function getModel(req, res, next) {
  let model = req.params.model;
  console.log(req.params);
  switch (model) {
  case 'users':
    req.model = new UsersModel();
    next();
    break;
  case 'games':
    req.model = new GamesModel();
    next();
    break;
  default :
    next('Invalid Model :(');
    break;
  }
}


module.exports = getModel;