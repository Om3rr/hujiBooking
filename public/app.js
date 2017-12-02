// Declare app level module which depends on views, and components
app = angular.module('tableApp', []);
$http = angular.injector(["ng"]).get("$http");

app.run(function ($rootScope) {

    $rootScope.helloServer = function () {
        return $http.get("/hello");
    };

    $rootScope.getSlots = function (date) {
        date = date ? date : moment();
        return $http.get("/slots?date=" + date.format('YYYY-MM-DD'));
    };

    $rootScope.getRooms = function () {
        return $http.get('/rooms');
    };

    $rootScope.postSlot = function (room, date, slot) {
        var params = {
            room: room,
            date: date.format('YYYY-MM-DD'),
            slot: slot,
            users: ['omer ha cool','ha','cool','gever','zaian']
        };
        return $http.post('/slot', params);
    };

    $rootScope.removeFriendAPI = function(friendName){
        var params = {
            friend: friendName,
            me: 'omer'
        };
        return $http.post('/friends/remove', params);
    };


    $rootScope.addFriend = function(friendName){
        var params = {
            friend: friendName
        };
        return $http.post('/friends', params);
    }

});


