const checkIfMultiplePropertiesExist  = (object) => {
    // check if an object contains more than one properties
    const objectEntries = Object.entries(object);
    return objectEntries.length > 1;
}

const checkIfAPropertyExist = (object) => {
    // check if an object has a property
    const objectEntries = Object.entries(object);
    return objectEntries.length == 1;
}

const checkIfObjectContainOnlyASpecificProperty = (object, propertieName) => {
    // check if an object only contains a specific property
    const objectEntries = Object.entries(object);
    return objectEntries.length == 1 && objectEntries[0][0] === propertieName;
}

const checkIfAPropertyIsANumber = (x) => {
    // check if a property is a number
    if (!x || isNaN(x))
        return false;
    return true;
}

const checkIfObjectIsEmpty = (object) => {
    // check if an object is empty
    return !object || Object.keys(object).length == 0;
}

module.exports = {
    checkIfMultiplePropertiesExist,
    checkIfAPropertyExist,
    checkIfObjectContainOnlyASpecificProperty,
    checkIfAPropertyIsANumber,
    checkIfObjectIsEmpty
}