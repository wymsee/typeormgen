const Big = require('big.js');
const moment = require('moment');
const timeRegex = /^([0-1]\d|2[0-3]):([0-5]\d):([0-5]\d)$/g;

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

const booleanTransformer = {
    from: function(value) {
        if (typeof value !== 'undefined' && value !== null) {
            return value ? true : false;
        }
        return value;
    },
    to: function(value) {
        if (value === true) {
            return 1;
        } else if (value === false) {
            return 0;
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

const timeTransformer = {
    // called on value when fetching from database
    from: function (value) {
        if (value && !moment.isMoment(value)) {
            if (value.match(timeRegex)) {
                return moment(value, 'HH:mm:ss');
            } else {
                return moment(value);
            }
        }
        return value;
    },
    // called on value before persisting to database
    to: function (value) {
        if (value) {
            if (!moment.isMoment(value)){
                if (value.match(timeRegex)) {
                    return moment(value, 'HH:mm:ss').format('HH:mm:ss');
                } else {
                    return moment(value).format('HH:mm:ss');
                }    
            }
            return value.format('HH:mm:ss');
        }
        return value;
    }
};

module.exports = {
    bigTransformer,
    booleanTransformer,
    momentTransformer,
    timeTransformer
};
