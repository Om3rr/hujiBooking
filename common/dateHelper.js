dateModule = {};

dateModule.getSunday = function(date){
    let today = new Date(date);
    console.log("Today is "+today.getDay());
    if(today.getDay() > 3 ){ // 4 is thursday..
        today.setDate(today.getDate() + (7 - today.getDay()))
    } else {
        today.setDate(today.getDate()-today.getDay())
    }
    return today.toLocaleString();
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