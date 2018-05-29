const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ObjectSchema = new Schema({
	key: { 
        type: String, 
        required: true
    },
	value: {
        type: String,
        required: true
    },
	timestamp: {
        type: Date,
        default: Date.now
    }
});

const ObjectModel = mongoose.model('Object', ObjectSchema);

module.exports = ObjectModel;

