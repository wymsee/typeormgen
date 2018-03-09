const Big = require('big.js');
const moment = require('moment');

const bigTransformer = {
    from: function(value) {
        if (value) {
            return new Big(value);
        }
        return value;
    },
    to: function(value) {
        if (value) {
            return value.toString();
        }
        return value;
    }
};

const momentTransformer = {
    // called on value when fetching from database
    from: function(value) {
        if (value) {
            return moment.utc(value);
        }
        return value;
    },
    // called on value before persisting to database
    to: function(value) {
        if (moment.isMoment(value)) {
            return value.utc().toISOString();
        }
        return value;
    }
};

module.exports = {
    bigTransformer,
    momentTransformer
};
