/**
 * Check is a function is asynchronous
 * @param {Function} func
 * @returns {Boolean} Return if the function is async or not 
 */
export const isAsyncFunction = (func) => {
    const string = func.toString().trim();

    return !!(
        // native
        string.match(/^async /) ||
        // babel (this may change, but hey...)
        string.match(/return _ref[^\.]*\.apply/)
    );
}