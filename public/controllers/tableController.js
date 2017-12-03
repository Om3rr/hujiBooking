app.controller('tableCtrl', ['$scope', function ($scope) {
    $scope.isLoading = true;
    $scope.init = function () {
        Promise.all([$scope.getRooms(), $scope.getSlots(), $scope.helloServer()]).then(function (resp) {
            $scope.rooms = resp[0].data;
            $scope.slots = resp[1].data;
            $scope.maxFrame = $scope.rooms.map(function (room) {
                return room.r_slots
            }).reduce(function (a, b) {
                return Math.max(a, b);
            });
            $scope.getThisWeekDates();
            $scope.activeDate = moment();
            $scope.marked = [];
            $scope.collabs = resp[2].data.give;
            $scope.friends = resp[2].data.take;
            $scope.participants = [];
            $scope.isLoading = false;
            $scope.$apply();
        });
    };

    $scope.getNumber = function (num) {
        arr = [];
        for (var i = 0; i < num; i++) {
            arr.push(i);
        }
        return arr;
    };

    $scope.slotFree = function (room, slot) {
        var roomSlots = $scope.slots[room.r_name];
        if (!roomSlots) {
            return true;
        }
        return !roomSlots[slot];
    };

    $scope.getUserName = function (room, slot) {
        var roomSlots = $scope.slots[room.r_name];
        if (!roomSlots) {
            return true;
        }
        return roomSlots[slot].b_user;
    };

    $scope.slotAndRoomToTime = function (slot) {
        var room = $scope.rooms[0];
        var delta = (room.r_end - room.r_start) / room.r_slots; // time for each slot in hours.
        var hoursToAdd = room.r_start + (delta * slot);
        return $scope.minToMss(hoursToAdd) + ' - ' + $scope.minToMss(hoursToAdd + delta);
    };

    $scope.minToMss = function (minutes) {
        var sign = minutes < 0 ? "-" : "";
        var min = Math.floor(Math.abs(minutes));
        var sec = Math.floor((Math.abs(minutes) * 60) % 60);
        return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
    };

    $scope.getThisWeekDates = function () {
        var currDay = moment();
        if (moment().startOf('week').day(4).hour(18) < moment()) {
            currDay.startOf('week').day(7);
        }
        $scope.dates = [
            moment(currDay).startOf('week'),
            moment(currDay).startOf('week').day(1),
            moment(currDay).startOf('week').day(2),
            moment(currDay).startOf('week').day(3),
            moment(currDay).startOf('week').day(4)
        ];
    };

    $scope.selected = function (date) {
        return $scope.activeDate.format('DD-MM') === date.format('DD-MM');
    };

    $scope.today = function (date) {
        return moment().format('DD-MM') === date.format('DD-MM');
    };

    $scope.datePass = function (date) {
        return moment() > date && !$scope.today(date);
    };

    $scope.selectDate = function (date) {
        if ($scope.datePass(date)) {
            return;
        }
        $scope.isLoading = true;
        $scope.activeDate = date;
        $scope.getSlots($scope.activeDate).then(function (resp) {
            setTimeout(function () {
                $scope.slots = resp.data;
                $scope.isLoading = false;
                $scope.$apply();
            }, 1000)
        })

    };

    $scope.markSlot = function (room, slot) {
        var elem = JSON.stringify({date: $scope.activeDate, room: room.r_id, slot: slot});
        var idx = $scope.marked.indexOf(elem);
        if (idx > -1) {
            $scope.marked.splice(idx,1);
        } else {
            $scope.marked.push(elem);
        }
        console.log($scope.marked);
    };

    $scope.sendSlots = function () {
        console.log("Sending");
        var posts = [];
        $scope.marked.forEach(function (mark) {
            mark = JSON.parse(mark);
            $scope.postSlot(mark.room, moment(mark.date), mark.slot).catch(function () {
                alert("Something went wrong.. sorry :)");
            });
            posts.push('1');
            if (posts.length === $scope.marked.length) {
                $scope.selectDate($scope.activeDate);
                $scope.marked = [];
            }
        });
    };

    $scope.removeFriend = function(friendName){
        var idx = $scope.friends.indexOf(friendName);
        if(idx < 0){
            return;
        }
        $scope.removeFriendAPI(friendName).then(function(){
            $scope.friends.splice(idx, 1);
            $scope.$apply();
        })
    };

    $scope.addNewFriend = function (friendName) {
        $scope.addFriend(friendName).then(function (resp) {
            $scope.newFriendName = '';
            $scope.friends.push(resp.data);
            $scope.$apply();
        }).catch(function (err) {
            console.log(err);
            alert("Cannot add new friend...");
        });
    };

    $scope.init();
}]);