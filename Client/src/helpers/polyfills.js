/**
 * Array.flat() polyfill
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat#reduce_concat_isArray_recursivity
 */
if (!Array.prototype.flat) {
    Array.prototype.flat = function (depth) {

        'use strict';

        // If no depth is specified, default to 1
        if (depth === undefined) {
            depth = 1;
        }

        // Recursively reduce sub-arrays to the specified depth
        var flatten = function (arr, depth) {

            // If depth is 0, return the array as-is
            if (depth < 1) {
                return arr.slice();
            }

            // Otherwise, concatenate into the parent array
            return arr.reduce(function (acc, val) {
                return acc.concat(Array.isArray(val) ? flatten(val, depth - 1) : val);
            }, []);

        };

        return flatten(this, depth);

    };
}

/**
 * Array.prototype.forEach() polyfill
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Array.prototype.forEach) {
    Array.prototype.forEach = function (callback, thisArg) {
        thisArg = thisArg || window;
        for (var i = 0; i < this.length; i++) {
            callback.call(thisArg, this[i], i, this);
        }
    };
}

/**
 * Array.prototype.find() polyfill
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/find
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Array.prototype.find) {
    Array.prototype.find = function (callback) {
        // 1. Let O be ? ToObject(this value).
        if (this == null) {
            throw new TypeError('"this" is null or not defined');
        }

        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // 3. If IsCallable(callback) is false, throw a TypeError exception.
        if (typeof callback !== 'function') {
            throw new TypeError('callback must be a function');
        }

        // 4. If thisArg was supplied, let T be thisArg; else let T be undefined.
        var thisArg = arguments[1];

        // 5. Let k be 0.
        var k = 0;

        // 6. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kValue be ? Get(O, Pk).
            // c. Let testResult be ToBoolean(? Call(callback, T, « kValue, k, O »)).
            // d. If testResult is true, return kValue.
            var kValue = o[k];
            if (callback.call(thisArg, kValue, k, o)) {
                return kValue;
            }
            // e. Increase k by 1.
            k++;
        }

        // 7. Return undefined.
        return undefined;
    }
}

/**
 * Array.filter() polyfill
 */
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter
if (!Array.prototype.filter) {
    Array.prototype.filter = function (func, thisArg) {
        'use strict';
        if (!((typeof func === 'Function' || typeof func === 'function') && this))
            throw new TypeError();

        var len = this.length >>> 0,
            res = new Array(len), // preallocate array
            t = this, c = 0, i = -1;
        if (thisArg === undefined)
            while (++i !== len)
                // checks to see if the key was set
                if (i in this)
                    if (func(t[i], i, t))
                        res[c++] = t[i];
                    else
                        while (++i !== len)
                            // checks to see if the key was set
                            if (i in this)
                                if (func.call(thisArg, t[i], i, t))
                                    res[c++] = t[i];

        res.length = c; // shrink down array to proper size
        return res;
    };
}


/**
* Array.prototype.fill() polyfill
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/fill#polyfill
* @license MIT
*/
if (!Array.prototype.fill) {
    Object.defineProperty(Array.prototype, 'fill', {
        value: function (value) {

            // Steps 1-2.
            if (this == null) {
                throw new TypeError('this is null or not defined');
            }

            var O = Object(this);

            // Steps 3-5.
            var len = O.length >>> 0;

            // Steps 6-7.
            var start = arguments[1];
            var relativeStart = start >> 0;

            // Step 8.
            var k = relativeStart < 0 ?
                Math.max(len + relativeStart, 0) :
                Math.min(relativeStart, len);

            // Steps 9-10.
            var end = arguments[2];
            var relativeEnd = end === undefined ?
                len : end >> 0;

            // Step 11.
            var finalValue = relativeEnd < 0 ?
                Math.max(len + relativeEnd, 0) :
                Math.min(relativeEnd, len);

            // Step 12.
            while (k < finalValue) {
                O[k] = value;
                k++;
            }

            // Step 13.
            return O;
        }
    })
}

/**
 * Array.map() polyfill
 */
// From https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map
// Production steps of ECMA-262, Edition 5, 15.4.4.19
// Reference: http://es5.github.io/#x15.4.4.19
if (!Array.prototype.map) {

    Array.prototype.map = function (callback/*, thisArg*/) {

        var T, A, k;

        if (this == null) {
            throw new TypeError('this is null or not defined');
        }

        // 1. Let O be the result of calling ToObject passing the |this|
        //    value as the argument.
        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get internal
        //    method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If IsCallable(callback) is false, throw a TypeError exception.
        // See: http://es5.github.com/#x9.11
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 1) {
            T = arguments[1];
        }

        // 6. Let A be a new array created as if by the expression new Array(len)
        //    where Array is the standard built-in constructor with that name and
        //    len is the value of len.
        A = new Array(len);

        // 7. Let k be 0
        k = 0;

        // 8. Repeat, while k < len
        while (k < len) {

            var kValue, mappedValue;

            // a. Let Pk be ToString(k).
            //   This is implicit for LHS operands of the in operator
            // b. Let kPresent be the result of calling the HasProperty internal
            //    method of O with argument Pk.
            //   This step can be combined with c
            // c. If kPresent is true, then
            if (k in O) {

                // i. Let kValue be the result of calling the Get internal
                //    method of O with argument Pk.
                kValue = O[k];

                // ii. Let mappedValue be the result of calling the Call internal
                //     method of callback with T as the this value and argument
                //     list containing kValue, k, and O.
                mappedValue = callback.call(T, kValue, k, O);

                // iii. Call the DefineOwnProperty internal method of A with arguments
                // Pk, Property Descriptor
                // { Value: mappedValue,
                //   Writable: true,
                //   Enumerable: true,
                //   Configurable: true },
                // and false.

                // In browsers that support Object.defineProperty, use the following:
                // Object.defineProperty(A, k, {
                //   value: mappedValue,
                //   writable: true,
                //   enumerable: true,
                //   configurable: true
                // });

                // For best browser support, use the following:
                A[k] = mappedValue;
            }
            // d. Increase k by 1.
            k++;
        }

        // 9. return A
        return A;
    };
}


/**
 * Array.prototype.reduce() polyfill
 * Adapted from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce
 * @author Chris Ferdinandi
 * @license MIT
 */
if (!Array.prototype.reduce) {
    Array.prototype.reduce = function (callback) {

        if (this === null) {
            throw new TypeError('Array.prototype.reduce called on null or undefined');
        }

        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        // 1. Let O be ? ToObject(this value).
        var o = Object(this);

        // 2. Let len be ? ToLength(? Get(O, "length")).
        var len = o.length >>> 0;

        // Steps 3, 4, 5, 6, 7
        var k = 0;
        var value;

        if (arguments.length >= 2) {
            value = arguments[1];
        } else {
            while (k < len && !(k in o)) {
                k++;
            }

            // 3. If len is 0 and initialValue is not present,
            //    throw a TypeError exception.
            if (k >= len) {
                throw new TypeError('Reduce of empty array ' +
                    'with no initial value');
            }
            value = o[k++];
        }

        // 8. Repeat, while k < len
        while (k < len) {
            // a. Let Pk be ! ToString(k).
            // b. Let kPresent be ? HasProperty(O, Pk).
            // c. If kPresent is true, then
            //    i.  Let kValue be ? Get(O, Pk).
            //    ii. Let accumulator be ? Call(
            //          callbackfn, undefined,
            //          « accumulator, kValue, k, O »).
            if (k in o) {
                value = callback(value, o[k], k, o);
            }

            // d. Increase k by 1.
            k++;
        }

        // 9. Return accumulator.
        return value;
    }
}