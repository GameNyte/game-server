'use strict';

const express = require('express');
const router = express.Router();

const oauth = require('./middleware/discord-oauth.js');

router.get('/', (req, res) => {
  res.send('In the oauth server');
  console.log(req.query);
  // res.status(200).send(req.token);

  // let responseCode = 404;
  // let content = '404 Error';

  // if (req.url === '/') {
  //   responseCode = 200;
  //   content = fs.readFileSync('./index.html');

  // }

  // res.writeHead(responseCode, {
  //   'content-type': 'text/html;charset=utf-8',
  // });

  // res.write(content);
  // res.end();

 
})

// https://discord.com/api/oauth2/authorize?client_id=741739015987921056&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth&response_type=code&scope=identify

module.exports = router;