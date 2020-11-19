Number.prototype.rounding = function(dec) {
    return Math.round((this + Number.EPSILON) * Math.pow(10, dec)) / Math.pow(10, dec);
}

