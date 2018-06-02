const express = require('express');
const {addObject, getObject} = require('../methods/objectMethod');

const objectRouter = express.Router();

objectRouter.route('/:key').get(getObject);// get request router
objectRouter.route('/').post(addObject);// post request router

module.exports = objectRouter;