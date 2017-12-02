module.exports = {};

module.exports.getSunday = function(date){
    let today = new Date(date);
    today.setDate(-today.getDay()).toLocaleString();
    return today;
};