app.controller('tableCtrl', ['$scope', function ($scope) {
    $scope.isLoading = true;
    $scope.init = function () {
        $scope.checkBoxes = {};
        Promise.all([$scope.getRooms(), $scope.helloServer()]).then(function (resp) {
            $scope.rooms = resp[0].data;
            $scope.maxFrame = $scope.rooms.map(function (room) {
                return room.r_slots
            }).reduce(function (a, b) {
                return Math.max(a, b);
            });
            $scope.maxEnd = $scope.rooms.map(function (room) {
                return room.r_end
            }).reduce(function (a, b) {
                return Math.max(a, b);
            });
            $scope.activeDate = getCurrentDay();
            $scope.activeTab = $scope.activeDate.format('YYYY-MM-DD');
            $scope.getThisWeekDates();

            $scope.marked = [];
            $scope.collabs = resp[1].data.give;
            $scope.friends = resp[1].data.take;
            $scope.me = resp[1].data.me;
            $scope.participants = {};
            $scope.selectDate($scope.activeDate);
        });
    };

    function getCurrentDay(){
        var today = moment();
        if(today.hour() > $scope.maxEnd){
            today = today.add(1, 'days');
        }
        if(today.day() > 4){
            return today.add(7 - today.day(), 'days');
        }
        return today;
    }

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
        return roomSlots[slot].users;
    };

    $scope.slotAndRoomToTime = function (slot) {
        var room = $scope.rooms[0];
        var delta = (room.r_end - room.r_start) / room.r_slots; // time for each slot in hours.
        var hoursToAdd = room.r_start + (delta * slot);
        return $scope.minToMss(hoursToAdd) + ' - ' + $scope.minToMss(hoursToAdd + delta);
    };

    $scope.isTimePassed = function(slot){
        var room = $scope.rooms[0];
        var slotTime = moment($scope.activeDate);
        var currTime = parseInt(room.r_start) + parseInt(slot);
        slotTime.hour(currTime);
        return slotTime < moment();

    };

    $scope.minToMss = function (minutes) {
        var sign = minutes < 0 ? "-" : "";
        var min = Math.floor(Math.abs(minutes));
        var sec = Math.floor((Math.abs(minutes) * 60) % 60);
        return sign + (min < 10 ? "0" : "") + min + ":" + (sec < 10 ? "0" : "") + sec;
    };

    $scope.getThisWeekDates = function () {
        var currDay = moment();
        // check if we are in the end of this week..
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
            console.log('date pass..');
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
        });
        $scope.beforeCurrent = $scope.dates.filter(function(d){return d <= $scope.activeDate});
        $scope.afterCurrent = $scope.dates.filter(function(d){return d > $scope.activeDate});
        $scope.initPassSlots();

    };

    $scope.initPassSlots = function () {
        $scope.isSlotPassed = $scope.getNumber($scope.maxFrame).map(function(n){return $scope.isTimePassed(n);});
    };

    $scope.markSlot = function (room, slot) {
        var elem = JSON.stringify({date: $scope.activeDate, room: room.r_id, slot: slot});
        var idx = $scope.marked.indexOf(elem);
        if (idx > -1) {
            $scope.marked.splice(idx, 1);
        } else {
            $scope.marked.push(elem);
        }
        console.log($scope.marked);
    };

    $scope.helpMe = function(){
        console.log("Hello");
        var a = "Welcome to cs huji reservation rooms,\n" +
            "To reserve a room in the system you need x friends with available time slots to successfully reserve a room for you.\n" +
            "To have friend in you friend list so you can reserve a room together, you need to get their approval to use their name, each friend need to and you cs username to in his consol.\n" +
            "After you friend will add you in his consol his name will appear in you consol, and you can close a room together\n" +
            "Be aware, that when you close a room with your friends both of you are losing from your weekly time slots.\n" +
            "If a friend of you are abusing you time slots, you can remove him from your approval list, and he will not be able to reserve a room with you.\n";
        $scope.errorAlert("Help", a);
    };

    $scope.bugReport = function(){
        $scope.errorAlert("Bug report", "To submit bug go into this google doc and describe the bug as possible\nhttps://github.com/Omertorren/bookingSystem");
    };
    function find(collabId){
        var idx = $scope.collabs.map(function(c){return c.u_id;}).indexOf(parseInt(collabId));
        if(idx < 0){
            return undefined;
        }
        return $scope.collabs[idx];
    }
    function validateRequest(){
        var friends = [];
        var friend;
        var slots = [];
        var error = false;
        angular.forEach($scope.checkBoxes, function (v, k) {
            if (!v) {
                return;
            }
            k = k.split(',');
            let date = moment(k[0]);
            let room_id = parseInt(k[1]);
            let slot = parseInt(k[2]);
            slots.push([room_id, date, slot, friends]);
        });
        angular.forEach($scope.participants, function (v, k) {
            if (!v) {
                return;
            }
            friend = find(k);
            friends.push(friend);
        });
        if(friends.length < 3){
            $scope.errorAlert("You got no enough friends to book this room", "This room require at least 4 people, right now you are only "+(friends.length+1));
            return false;
        }
        if($scope.me.orders < slots.length){
            $scope.errorAlert("You got no enough orders", "You got only " + $scope.me.orders + " hours left");
            return false;
        }
        for(var i=0;i<friends.length;i++) {
            friend = friends[i];
            if (friend.orders < slots.length) {
                $scope.errorAlert("Your friend got no enough orders", "Your friend " + friend.u_fullname + " got only " + friend.orders + " hours left");
                return false;
            }
        }

    }

    $scope.sendSlots = function () {
        if(!validateRequest()){
            return;
        }
        $scope.isLoading = true;
        var friends = [];
        angular.forEach($scope.participants, function (v, k) {
            if (!v) {
                return;
            }
            friends.push(parseInt(k));
        });
        var mcboomy = [];
        angular.forEach($scope.checkBoxes, function (v, k) {
            if (!v) {
                return;
            }
            k = k.split(',');
            let date = moment(k[0]);
            let room_id = parseInt(k[1]);
            let slot = parseInt(k[2]);
            mcboomy.push([room_id, date, slot, friends]);
        });
        var promises = [];
        mcboomy.forEach(function(l){
            console.log(l);
           promises.push($scope.postSlot(l[0], moment(l[1]), l[2], l[3], mcboomy.length))
        });
        Promise.all(promises).then(function () {
            $scope.checkBoxes = {};
            $scope.participants = {};
            $scope.selectDate($scope.activeDate);
            $scope.refreshHello();
            $scope.isLoading = false;
        }).catch(function(err){
            $scope.errorAlert("Error", err.data);
            $scope.isLoading = false;
        })
    };

    $scope.refreshHello = function(){
        $scope.helloServer().then(function(resp){
            $scope.collabs = resp.data.give;
            $scope.friends = resp.data.take;
            $scope.me = resp.data.me;
        })
    };

    $scope.removeFriend = function (friendName) {
        var idx = $scope.friends.indexOf(friendName);
        if (idx < 0) {
            return;
        }
        $scope.removeFriendAPI(friendName).then(function () {
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

    $scope.mark = function(activeDate, room, timeFrame){
        if(!$scope.slotFree(room, timeFrame)){
            console.log('Scope not free');
            return;
        }
        if($scope.isSlotPassed[timeFrame]){
            console.log("Scope passed");
            return;
        }
        var checkBoxLocation = activeDate.toLocaleString() + ',' + room.r_id + ',' + timeFrame;
        console.log(checkBoxLocation, 'before', $scope.checkBoxes[checkBoxLocation]);
        $scope.checkBoxes[checkBoxLocation] = !$scope.checkBoxes[checkBoxLocation];
        console.log($scope.checkBoxes[checkBoxLocation], 'after');
    };

    $scope.init();
}]);