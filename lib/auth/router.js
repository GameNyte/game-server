'use strict';

const express = require('express');
const router = express.Router();
const cors = require('cors');

const oauth = require('./middleware/discord-oauth.js');

router.use(cors());

router.get('/', oauth, (req, res) => {
  console.log('req.user, req.token from oauth middleware', req.user, req.token);
  // res.redirect();
  res.send('Waiting after oauth');
})

module.exports = router;


/*
Things that may need to change as the routes change

.env
1. REDIRECT_URI
2. maybe...possibly... CLIENT_ID and CLIENT_SECRET

In Discord Dashboard Website
1. identifier string that Discord gives you with all your shi... in it
https://discord.com/api/oauth2/authorize?client_id=742459492511252501&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth&response_type=code&scope=identify

*/