const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Turn = new Schema({
    TurnNumber: {
        type: Number
    },
    Next: {
        type: Number
    },
    Previous: {
        type: Number
    },
    MinutesLeft: {
        type: Number
    }
});

module.exports = mongoose.model('turn', Turn);