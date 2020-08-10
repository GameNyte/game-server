'use strict';

const express = require('express');
const router = express.Router();

const oauth = require('./middleware/discord-oauth.js');



router.get('/', oauth, (req, res) => {

  res.send('Waiting after oauth');
})

// https://discord.com/api/oauth2/authorize?client_id=742459492511252501&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth&response_type=code&scope=identify

module.exports = router;