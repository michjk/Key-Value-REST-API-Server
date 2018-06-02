const checkIfMultiplePropertiesExist  = (object) => {
    const objectEntries = Object.entries(object);
    return objectEntries.length > 1;
}

const checkIfAPropertyExist = (object) => {
    const objectEntries = Object.entries(object);
    return objectEntries.length == 1;
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
    return !object || Object.keys(object).length == 0;
}

module.exports = {
    checkIfMultiplePropertiesExist,
    checkIfAPropertyExist,
    checkIfObjectContainOnlyASpecificProperty,
    checkIfAPropertyIsANumber,
    checkIfObjectIsEmpty
}