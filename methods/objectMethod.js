const logger = require('winston');
const ObjectModel = require('../models/object');
const util = require('../utils/util');
_ = require('lodash');

const getObject = async(req, res, next) => {
    logger.info('getObject');
    logger.info(req.params.key);
    logger.info(req.params.query);

    if (util.checkIfMultiplePropertiesExist(req.query)) {
        return next(new Error('Query parameter should not more than 1!'));
    }
    
    if (util.checkIfAPropertyExist(req.query)) {
        if (!util.checkIfObjectContainOnlyASpecificProperty(req.query, 'timestamp')) {
            return next(new Error('timestamp should be the only query parameter!'));
        }
    }

    let timestamp = req.query.timestamp;
    
    if (!util.checkIfAPropertyIsANumber(timestamp)) {
        return next(new Error('Incorrect timestamp value!'));
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
    logger.info('addObject');
    logger.info(req.body);
    if (util.checkIfObjectIsEmpty(req.body)) {
        return next(new Error("Body must contain JSON!"));
    }

    if (util.checkIfMultiplePropertiesExist(req.body)) {
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