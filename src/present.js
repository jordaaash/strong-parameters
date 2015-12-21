'use strict';

var present = function (value) {
    if (typeof value === 'string') {
        return value.trim() !== '';
    }
    return value != null;
};

module.exports = present;
