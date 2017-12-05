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

    $rootScope.postSlot = function (room, date, slot, users) {
        var params = {
            room: room,
            date: date.format('YYYY-MM-DD'),
            slot: slot,
            users: users
        };
        return $http.post('/slots', params);
    };

    $rootScope.removeFriendAPI = function (friend) {
        return $http.post('/friends/delete/' + friend.u_id);
    };


    $rootScope.addFriend = function (friendName) {
        return $http.post('/friends', {friend: friendName});
    };

    $rootScope.loginAccount = function (params) {
        return $http.post('/confirm/login', params);
    };

    $rootScope.createNewAccount = function (params) {
        return $http.post('/confirm/register', params);
    };

});


