
/**
 * A collection of universal function for strings, integers, objects and arrays.
 *
 * @author <Rthr-X>
 */

/* ==================================================================================================== */

/**
 * Interpret a string of dot-delimited properties to the actual property of the given object
 *
 * @example objectIndex({field: {property: 100}}, 'field.property') === 100
 *
 * @param {object} object An object
 * @param {string} index  A dot-delimited index to search for
 * @return {mixed}        Returns undefined if the specified index does not exist
 */
function objectIndex(object, index) {
    return index.split('.').reduce(function (obj, i) {
        return obj ? obj[i] : undefined;
    }, object);
}

/**
 * Insert the objectIndex function into the Object class
 *
 * @example Object.index({field: {property: 100}}, 'field.property') === 100
 *
 * @param {object} object An object
 * @param {string} index  A dot-delimited index to search for
 * @return {mixed}        Returns undefined if the specified index does not exist
 */
Object.index = objectIndex;

/* ==================================================================================================== */
/* OBJECT */

/**
 * Implementation of the objectIndex function (see above) into the Object prototype
 * 
 * @example ({field: {property: 100}}).index('field.property') === 100
 * 
 * @param {string} index A dot-delimited index to search for
 * @return {mixed}
 */
Object.prototype.index = function (index) {
    return objectIndex(this, index);
};

/* ==================================================================================================== */
/* ARRAY */

/**
 * Given a 'template' object with a unique index property (default 'id'), return the array index
 *
 * @param {object} object The 'template' object to search for
 * @param {string} uid    (optional) The unique identifier to use as an index (default 'id')
 * @return {int|bool}     False if the item was not found, or the int index of the item
 */
Array.prototype.findIndex = function (object, uid) {
    uid = typeof uid !== 'undefined' ? uid : 'id';
    
    if (typeof objectIndex(object, uid) === 'undefined') {
        return false;
    }
    
    var foundIndex = false;
    this.forEach(function (item, index) {
        if (typeof item === 'object' && typeof objectIndex(item, uid) !== 'undefined' && objectIndex(item, uid) === objectIndex(object, uid)) {
            foundIndex = index;
        }
    });
    
    return foundIndex;
};
  
/**
 * Given a 'template' object with a unique index property (default 'id'), remove (the first
 * instance of) that object from this array
 *
 * @param {object} object The 'template' object to remove from the array
 * @param {string} uid    (optional) The unique identifier to use as an index (default 'id')
 * @return {bool}         True if an item was removed from the array
 */
Array.prototype.remove = function (object, uid) {
    uid = typeof uid !== 'undefined' ? uid : 'id';
    
    if (this.findIndex(object, uid)) {
        this.splice(this.findIndex(object, uid), 1);
        return true;
    }
    return false;
};

/**
 * Given a 'template' object with a unique index property (default 'id'), replace (the first
 * instance of) that object in this array with the provided object, or if that index was not
 * found, append the provided object to the array instead
 *
 * @param {object} object The 'template' object
 * @param {string} uid    (optional) The unique identifier to use as an index (default 'id')
 * @return self
 */
Array.prototype.replace = function (object, uid) {
    uid = typeof uid !== 'undefined' ? uid : 'id';
  
    if (this.findIndex(object.uid)) {
        this.splice(this.findIndex(object, uid), 1, object);
    } else {
        this.push(object);
    }
    return this;
};

/**
 * Filter an array by elements which match the .contains(query) check; notably, this will only
 * return string values (or any other type that has a 'contains' method)
 *
 * @example ['one', 'two', 'three'].containsString('e') === ['one', 'three']
 *
 * @param {string} query                  A string to search this array for
 * @param {bool} caseSensitive (optional) If true, enforce case sensitivity (default false)
 * @return {array}                        Array of entries that match the query
 */
Array.prototype.containsString = function (query, caseSensitive) {
    caseSensitive = typeof caseSensitive !== 'undefined' ? caseSensitive : false;
    
    var itemsFound = [];
    this.forEach(function (item) {
        if (typeof item.contains !== 'undefined' && item.contains(query, caseSensitive)) {
            itemsFound.push(item);
        }
    });
    return itemsFound;
};

/**
 * Find the lowest value in the array
 *
 * @return {number}
 */
Array.prototype.min = function () {
    return Math.min.apply(Math, this);
};

/**
 * Find the highest value in the array
 *
 * @return {number}
 */
Array.prototype.max = function () {
    return Math.max.apply(Math, this);
};

/**
 * Return the last element in an array or null if nothing
 *
 * @example [1, 2, 3].end() === 3
 *
 * @return {varies}
 */
Array.prototype.end = function () {
    return this.length ? this[this.length - 1] : null;
};
 
/**
 * Stand-alone version of the above
 *
 * @example Array.end([1, 2, 3]) === 3
 *
 * @param {array} input Array
 * @return {varies}
 */
Array.end = function (input) {
    return (input && typeof input === 'object' && input.constructor === Array && input.length) ? input[input.length - 1] : null;
};

/* ==================================================================================================== */
* NUMBER */

/**
 * Mostly used as a safety net; this allows for a variable which may or may not be a number to 
 * call 'variable.toInt()', and both String and Number values will return an integer value
 *
 * @return {int}
 */
Number.prototype.toInt = function () {
    return parseInt(this);
};

/* ==================================================================================================== */
/* STRING */

/**
 * Check if a string contains the query string within it anywhere; by default, this check
 * is NOT CASE SENSITIVE; set the caseSensitive argument to true to force that behavior
 *
 * @param {string} query       A string to check for
 * @param {bool} caseSensitive Force the check to be case-sensitive (default false)
 * @return {bool}              Returns true if the query was found in the string
 */
 String.prototype.contains = function (query, caseSensitive) {
     caseSensitive = typeof caseSensitive !== 'undefined' ? caseSensitive : false;
     return (
         caseSensitive
         ? this.indexOf(query) !== -1
         : this.toLowerCase().indexOf(query.toLowerCase()) !== -1
     );
 };

/**
 * Get the integer value of a string, or 0 if the string is not a numeric value; Note that
 * a string like '3xx' will return a value of 3
 *
 * @return {int} The integer value of this string; returns a 0 instead of NaN
 */
String.prototype.toInt = function () {
    return parseInt(this) ? parseInt(this) : 0;
};

/**
 * Check if a string is actually a JSON object (that is, it can be parsed as a valid JSON object);
 * Note that the strings 'true' and 'false' will return true, as those ARE valid JSON values
 *
 * @return {bool}
 */
String.prototype.isJSON = function () {
    var isValidJSON = true;
    try {
        JSON.parse(this);
    } catch (error) {
        isValidJSON = false;
    }
    return isValidJSON;
};

/**
 * A JavaScript implementation of the PHP printf() function
 *
 * @example 'This is a {0} string {1}'.format('formatted', 'dude') === 'This is a formatted string dude'
 *
 * @return {string}
 */
String.prototype.format = function () {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{' + i + '\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};
 
/* ==================================================================================================== */
/* PARSE */

/**
 * Parse is a "static class", with several static methods for interpreting various input
 * values in a consistent manner
 */
function Parse() {'use strict';}

/**
 * Retrieve the integer value of the input; utilizes the 'toInt' method of the input if
 * it exists (usually for String and Number; add a .toInt method to custom objects to
 * use that as well)
 *
 * @param {varies}
 * @return {int}
 */
Parse.int = function (input) {
    return typeof input.toInt !== 'undefined' ? input.toInt() : parseInt(input);
};

 
 
 
