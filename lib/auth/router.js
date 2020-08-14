'use strict';

const express = require('express');
const router = express.Router();
const cors = require('cors');

const oauth = require('./middleware/discord-oauth.js');

router.use(cors());

router.get('/', oauth, (req, res) => {
  res.cookie('token', req.token);
  res.header('token', req.token);
 
  res.redirect(`https://master.djnfqbxtyrn7f.amplifyapp.com/?token=${req.token}`);
})

module.exports = router;

