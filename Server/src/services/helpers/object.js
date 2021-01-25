/**
 * Rename object's keys
 * @param {Object} obj 
 * @param {String} newKey 
 * @param {String} oldKey 
 */
export const renameObjectKey = (obj, newKey, oldKey) => {
    if (oldKey !== newKey) {
        Object.defineProperty(obj, newKey,
            Object.getOwnPropertyDescriptor(obj, oldKey));
        delete obj[oldKey];
    }
};