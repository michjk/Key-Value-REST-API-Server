const express = require('express');
const {addObject, getObject} = require('../methods/objectMethod');

const objectRouter = express.Router();

objectRouter.route('/:key').get(getObject);
objectRouter.route('/').post(addObject);

module.exports = objectRouter;