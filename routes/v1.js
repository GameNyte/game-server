'use strict';

const express = require('express');
const router = express.Router();

const Model = require('../middleware/models.js');

router.param('model', Model);


router.get('/:model', handleGetAll);
router.get('/:model/:id', handleGetById);
router.post('/:model', handleCreate);
router.put('/:model/:id', handleUpdate);
router.delete('/:model/:id', handleDelete);




async function handleGetById(req, res) {
  const Id = req.params.id;
  const results = await req.model.get(Id);
  res.send('Here are your Users! ' + results);
}



async function handleGetAll(req, res) {
  const results = await req.model.get();
  res.send(results);

}



async function handleCreate(req, res) {
  const results = await req.model.create(req.body);
  res.send(results + ' Has been created');

}

async function handleUpdate(req, res) {
  const results = await req.model.update(req.params.id, req.body);
  res.send('Updated! ' + req.params.id);
}


async function handleDelete(req, res) {
  const results = await req.model.delete(req.params.id);
  res.send('Removed ID: ' + req.params.id);
}





module.exports = router;