dateModule = {};

dateModule.getSunday = function(date){
    let today = new Date(date);
    today.setDate(today.getDate()-today.getDay()).toLocaleString();
    return today;
};

dateModule.isValidDate = function(date){
    var givenDate = new Date(date);
    var sunday = dateModule.getSunday(new Date());
    var thursday = new Date(sunday);
    var today = new Date();
    thursday.setDate(thursday.getDate() + 4);
    return givenDate >= today && givenDate <= thursday;

}



module.exports = dateModule;