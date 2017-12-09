// Declare app level module which depends on views, and components
app = angular.module('tableApp', ['ngMaterial']);
$http = angular.injector(["ng"]).get("$http");

app.run(function ($rootScope, $mdDialog) {

    $rootScope.errorAlert = function(title, msg, ev){
        $mdDialog.show(
            $mdDialog.alert()
                .parent(angular.element(document.querySelector('#popupContainer')))
                .clickOutsideToClose(true)
                .title(title)
                .content(msg)
                .ariaLabel('Alert Alert Alert')
                .ok('Got it!')
                .targetEvent(ev)
        );
    };

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

    $rootScope.postSlot = function (room, date, slot, users, overall) {
        var params = {
            room: room,
            date: date.format('YYYY-MM-DD'),
            slot: slot,
            users: users,
            overall : overall
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

    $rootScope.resetApi = function (user) {
        return $http.post('/forget/'+user);
    };

    $rootScope.forgotMyPass = function (params) {
        return $http.post('/forget', params);
    };

});


