const ObjectModel = require('../models/object');
const _ = require('lodash');

const getObject = async(req, res, next) => {
    
    let timestamp = _.has(req.query, 'timestamp') ? req.query.timestamp : null;
    
    if ( _.has(req.query, 'timestamp')) {
        if (!timestamp || isNaN(timestamp))
            return next(new Error('Incorrect timestamp value!'))
    }

    try {
        const queryDict = {'key': req.params.key};
        if (timestamp)
            queryDict['timestamp'] = {'$lte': Number(timestamp)};
        
        const objectResult = await ObjectModel
            .findOne(queryDict)
            .sort({ 
                timestamp: -1 
            });
        const value = objectResult.value;
        res.json({ value });
    } catch (err) {
        next(new Error(`Value of ${req.params.key} is not found!`));
    }
}

const addObject = async(req, res, next) => {
    console.log(req.body);
    if (!req.body || Object.keys(req.body).length == 0) {
        return next(new Error("Data empty!"));
    }

    if (Object.keys(req.body).length > 1) {
        return next(new Error("Data must contains only one key-value pair!"));
    }

    const key = Object.keys(req.body)[0];
    const value = req.body[key];

    if (!value) {
        return next(new Error(`Value of ${key} must be not empty!`));
    }

    if (typeof value !== 'string') {
        return next(new Error(`Value of ${key} must be a string!`));
    }

    try {
        const newObject = await ObjectModel.create({ key, value });
        const timestamp = newObject.timestamp;
        
        res.status(200).json({ key, value, 'timestamp': timestamp.getTime() });
    } catch (err) {
        next(err);
    }
}

module.exports = {
    addObject,
    getObject
}