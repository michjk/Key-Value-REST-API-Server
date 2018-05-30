const ObjectModel = require('../models/object');
const _ = require('lodash');

const getObject = async(req, res, next) => {
    
    let timestamp = _.has(req.query, 'timestamp') ? req.query.timestamp : null;

    if ( _.has(req.query, 'timestamp') && (!timestamp || isNaN(timestamp))) {
        console.log(isNaN(timestamp));
        console.log(!timestamp);
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
        console.log(objectResult);
        const value = objectResult.value;
        res.json({ value });
    } catch (err) {
        next(err);
    }
}

const addObject = async(req, res, next) => {
    console.log(req.body);
    if (!req.body) {
        return next(new Error("Data empty!"));
    }
    console.log(req.body);
    for (let key in req.body) {
        console.log(key);
        let value = req.body[key];
        if (typeof value !== 'string') {
            return next(new Error(`Value of ${key} must be a string`));
        }

        try {
            const newObject = await ObjectModel.create({ key, value });
            const timestamp = newObject.timestamp;
            
            res.status(200).json({ key, value, 'timestamp': timestamp.getTime() });
        } catch (err) {
            next(err);
        }
    }
}

module.exports = {
    addObject,
    getObject
}