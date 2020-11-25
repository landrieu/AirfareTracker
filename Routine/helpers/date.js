/**
 * Break down a date, to get an object containing the year, month, day, hour and minute
 * @param {Date} date 
 */
export const breakDownDate = (date) => {
    date = new Date(date)
  
    let year = date.getFullYear()
    let month = date.getMonth() + 1
    let day = date.getDate()

    let hour = date.getHours()
    let min = date.getMinutes()


    if(month < 10) month = '0' + month
    if(day < 10) day = '0' + day
    if(hour < 10) hour = '0' + hour
    if(min < 10) min = '0' + min

    return {year, month, day, hour, min}
}

/**
 * Check if the date is similar
 * @param {Date} startDate 
 * @param {Date} endDate 
 */
export const rangeSameDay = (startDate, endDate) => {
    return startDate.year === endDate.year &&
        startDate.month === endDate.month &&
        startDate.day === endDate.day
}

/**
 * Check if the time is similar
 * @param {Date} startDate 
 * @param {Date} endDate 
 */
export const rangeSameTime = (startDate, endDate) => {
    return startDate.hour === endDate.hour &&
        startDate.min === endDate.min
}

/**
 * Format two dates, to get an array
 * First element is a string containing a range date
 * Second element is a string containing a range time
 * @param {Date} startDate 
 * @param {Date} endDate 
 */
export const rangeDate = (startDate, endDate) => {
    let dStartDate = breakDownDate(startDate)
    let dEndDate = breakDownDate(endDate)

    let dateOptions = { weekday: 'short', year: 'numeric', month: 'short', day: '2-digit', timeZone: 'UTC' };
    let timeOptions = { hour12: false, hour: '2-digit', minute:'2-digit', timeZone: 'UTC' }

    let date = startDate.toLocaleString('en-EN', dateOptions);
    if(!rangeSameDay(dStartDate, dEndDate)) date += ` - ${endDate.toLocaleString('en-EN', dateOptions)}`
    date = date.replace(/,/g, '')

    let time = startDate.toLocaleString('en-EN', timeOptions)
    if(!rangeSameTime(dStartDate, dEndDate)) time += `- ${endDate.toLocaleString('en-EN', timeOptions)}`
     
    return [date, time]
}

export const listPossibleDates = (startDates, endDates) => {
    return startDates.map(startDate => endDates.map(endDate => {startDate, endDate}))
    .reduce((acc, val) => [...acc, ...val], []);
}

export const formatDate = (date, format = 'YYYYMMDD', separator = '-') => {
    let dateF = breakDownDate(new Date(date));

    if(format === 'YYYYMMDD'){
        return `${dateF.year}${separator}${dateF.month}${separator}${dateF.day}`;
    }else if(format === 'DDMMYYYY'){
        return `${dateF.day}${separator}${dateF.month}${separator}${dateF.year}`;
    }else{
        return date;
    }
}

/**
 * Convert an array to an object, by default the id is the object key
 * @param {Array[Object]} arr 
 * @param {String} keyProperty 
 */
export const convertArrayToObject = (arr, keyProperty = "id") => {
    let obj = {}

    arr.forEach(el => {
        if(el.hasOwnProperty(keyProperty)){
            obj[el[keyProperty]] = el
        }
    })

    return obj
}

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