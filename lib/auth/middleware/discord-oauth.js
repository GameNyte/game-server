'use strict';

const superagent = require('superagent');

const tokenUrl = 'https://discordapp.com/api/oauth2/token';
// const remoteUserUrl = 'https://discord.com/api/v6';
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = 'http://localhost:3000/oauth';

let SECRET = 'secretsignature';

module.exports = async function authorize(req, res, next) {

  let code = req.query.code;
  console.log('(1) CODE', code);

  let access_token = await exchangeCodeForToken(code);
  console.log('(2) ACCESS_TOKEN', access_token);

  let user = await getRemoteUserInfo(access_token);
  console.log('(3) REMOTE USER INFO FROM DISCORD', user.body);

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
  console.log('tokenResponse.body', tokenResponse.body);
  return access_token;
}

async function getRemoteUserInfo(token) {

  let userResponse = await superagent
    .get('https://discordapp.com/api/users/@me')
    .set('Authorization', `Bearer ${token}`)

  let user = userResponse;

  return user;
}