'use strict';

require('harmony-reflect');

class StrongParameters {
    constructor (parameters) {
        parameters = Object.assign({}, parameters);

        return new Proxy(this, {
            get (target, key) {
                var value;
                console.log('get', key);
                switch (key) {
                    case 'constructor':
                    case 'prototype':
                    case 'require':
                    case 'permit':
                        return target[key];
                    default:
                        value = parameters[key];
                        return target.convert(value);
                }
            },
            getPrototypeOf (target) {
                console.log('getPrototypeOf');
                return target.prototype;
            },
            set (target, key, value) {
                console.log('set', key);
                throw new Error('immutable');
            },
            enumerate (target) {
                console.log('enumerate');
                return Object.keys(target);
            }
        });
    }

    require (key) {
        var value = this[key];
        if (value == null) {
            throw new Error('required');
        }
        return value;
    }

    permit () {

    }

    convert (value) {
        if (value == null) {
            return value;
        }
        else {
            switch (typeof value) {
                case 'string':
                case 'number':
                case 'boolean':
                    return value;
                case 'object':
                    if (Array.isArray(value)) {
                        return value.map(this.convert, this);
                    }
                    else if (value instanceof StrongParameters || value instanceof Date) {
                        return value;
                    }
                    else {
                        return new this.constructor(value);
                    }
                default:
                    throw new Error('invalid value');
            }
        }
    }
}

module.exports = StrongParameters;
