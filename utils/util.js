const checkIfMultiplePropertiesExist  = (object) => {
    const objectEntries = Object.entries(object);
    return objectEntries.length > 1;
}

const checkIfObjectContainOnlyASpecificProperty = (object, propertieName) => {
    const objectEntries = Object.entries(object);
    return objectEntries.length == 1 && objectEntries[0][0] === propertieName;
}

const checkIfAPropertyIsANumber = (x) => {
    if (!x || isNaN(x))
        return false;
    return true;
}

const checkIfObjectIsEmpty = (object) => {
    return !req.body || Object.keys(req.body).length == 0;
}

module.exports = {
    checkIfMultiplePropertiesExist,
    checkIfObjectContainOnlyASpecificProperty,
    checkIfAPropertyIsANumber,
    checkIfObjectIsEmpty
}