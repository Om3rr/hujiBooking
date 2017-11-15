// Declare app level module which depends on views, and components
app = angular.module('tableApp', []);
$http = angular.injector(["ng"]).get("$http");

app.run(function($rootScope){

   $rootScope.getSlots = function(date){
       date = date ? date : moment();
       return $http.get("/slots?date="+date.format('YYYY-MM-DD'));
   };

   $rootScope.getRooms = function(){
       return $http.get('/rooms');
   };

    $rootScope.postSlot = function(room, date, slot){
        var params = {
            room : room,
            date : date.format('YYYY-MM-DD'),
            slot : slot,
            user : 'omer ha cool'
        };
        return $http.post('/slot', params);
    };

});


