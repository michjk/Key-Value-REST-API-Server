const logger = require('winston');
const ObjectModel = require('../models/object');
const util = require('../utils/util');
_ = require('lodash');

const getObject = async(req, res, next) => {
    // method for get request /object/key

    logger.info('getObject');
    logger.info(req.params.key);
    logger.info(req.params.query);

    // check if there is query parameter more than 1
    if (util.checkIfMultiplePropertiesExist(req.query)) {
        return next(new Error('Query parameter should not more than 1!'));
    }
    
    let timestamp = null;

    // check if there is a query paremeter
    if (util.checkIfAPropertyExist(req.query)) {

        // check if timestamp is the only query parameter
        if (!util.checkIfObjectContainOnlyASpecificProperty(req.query, 'timestamp')) {
            return next(new Error('timestamp should be the only query parameter!'));
        }
        timestamp = req.query.timestamp;
        // check if timestamp have correct type
        if (!util.checkIfAPropertyIsANumber(timestamp)) {
            return next(new Error('Incorrect timestamp value!'));
        }
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
    // method for POST request /object

    logger.info('addObject');
    logger.info(req.body);

    // check if body is empty
    if (util.checkIfObjectIsEmpty(req.body)) {
        return next(new Error("Body must contain JSON!"));
    }

    // check if multiple key-value pair exist
    if (util.checkIfMultiplePropertiesExist(req.body)) {
        return next(new Error("Data must contains only one key-value pair!"));
    }

    const key = Object.keys(req.body)[0];
    const value = req.body[key];

    // check if value is empty
    if (!value) {
        return next(new Error(`Value of ${key} must be not empty!`));
    }

    // check if value is not a string
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