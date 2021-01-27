Date.prototype.timestamp = function(){
    return Math.floor(new Date(this).getTime() / 1000);
}

Date.prototype.addSeconds = function(s) {
    this.setTime(this.getTime() + (s*1000));
    return this;
}

Date.prototype.addMinutes = function(m) {
    this.setTime(this.getTime() + (m*this.addSeconds(60)*1000));
    return this;
}

Date.prototype.addHours = function(h) {
    this.setTime(this.getTime() + (h*60*60*1000));
    return this;
}

Date.prototype.addDays = function(d) {
    this.setTime(this.getTime() + (d*24*60*60*1000));
    return this;
}

Date.prototype.addWeeks = function(w) {
    this.setTime(this.getTime() + (w*7*24*60*60*1000));
    return this;
}

Date.prototype.addMonths = function(m) {
    let weeksPerMonth = 52 / 12;
    this.setTime(this.getTime() + (m*weeksPerMonth*7*24*60*60*1000));
    return this;
}

Date.prototype.addYears = function(y) {
    let weeksPerMonth = 52 / 12;
    this.setTime(this.getTime() + (y*12*weeksPerMonth*7*24*60*60*1000));
    return this;
}

Date.prototype.clone = function() { 
    return new Date(this.getTime()); 
};

Number.prototype.rounding = function(dec) {
    return Math.round((this + Number.EPSILON) * Math.pow(10, dec)) / Math.pow(10, dec);
}