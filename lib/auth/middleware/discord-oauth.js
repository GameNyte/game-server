'use strict';

const superagent = require('superagent');
// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const tokenUrl = process.env.TOKEN_URL;
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const SECRET = process.env.SECRET;

const UserModel = require('../../../middleware/models/users/users-model.js');
let User = new UserModel();

module.exports = async function authorize(req, res, next) {

  let code = req.query.code;
  console.log('(1) CODE: ', code);

  try {

    let access_token = await exchangeCodeForToken(code);
    console.log('(2) ACCESS_TOKEN: ', access_token);

    let user = await getRemoteUserInfo(access_token);
    console.log('(3) REMOTE USER INFO FROM DISCORD: ', user.body);

    let appUser = await getUser(user.body);
    console.log('(4) OUR APP USER: ', appUser);

    req.user = appUser.user; 
    req.token = appUser.token;

    next();
  } catch (error) {
    next('Error from oauth authorization: ', error);
  }
}

async function exchangeCodeForToken(code) {

  const data = {
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    grant_type: 'authorization_code',
    redirect_uri: REDIRECT_URI,
    code: code,
    scope: 'identify',
  }
  console.log('data!!!!', data);

  let tokenResponse = await superagent
    .post(tokenUrl)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .send(data);

  let access_token = tokenResponse.body.access_token;
  return access_token;
}

async function getRemoteUserInfo(token) {

  let userResponse = await superagent
    .get('https://discordapp.com/api/users/@me')
    .set('Authorization', `Bearer ${token}`)

  let user = userResponse;
  return user;
}

async function getUser(user) {

  let userRecord = {
    username: `${user.username}${user.discriminator}`,
    password: 'oauthpassword',
  }

  //Check to see if user exists
  let userExists = User.exists({ username: userRecord.username })
  if (userExists) {
    console.log('user aleady in database');

    let token = await jwt.sign({username: userRecord.username}, SECRET);
    console.log('jwt createad with userRecord.username, SECRET', token);
    
    return { user: userRecord.username, token: token};
  }

  if (!userExists) {
    console.log('creating a new user');

    let newUser = await User.create({ username: userRecord.username, password: userRecord.password });
    console.log('newUser stored to mongo', newUser);
    
    let token = await jwt.sign({username: userRecord.username}, SECRET);
    console.log('jwt created with userRecord.username, SECRET', token);

    return { user: userRecord.username, token: token};
  }

  // let password = await bcrypt.hash(userRecord, SECRET); 


  // if (newUser) {
  // }
    
  //   res.cookie('token', token);
  //   res.header('token', token);
  //   res.send({ token, user: req.user });
  // } else {
  //   res.status(403).send('User Invalid');


  // let token = await jwt.sign(userObject, SECRET);

  // we can do user like stuff here.
  // let User = await user.save(userObject);
  // console.log('userObject', userObject, 'token', token)

  // return { user: userObject, token: token };

  // return { user: newUser, token: token }

}