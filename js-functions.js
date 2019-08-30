
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
 
 
 
