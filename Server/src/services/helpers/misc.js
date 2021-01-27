/**
 * 
 * @param  {...Boolean|String|Number} v 
 */
export const isNullOrUndefined = (...v) => {
    for(let i = 0; i < v.length; i++){
        if(v[i] === undefined || v[i] === null) return true;
    }
    return false;
};