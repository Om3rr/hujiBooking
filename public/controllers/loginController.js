app.controller('loginCtrl', ['$scope', function ($scope) {
    $scope.reseted = true;
    $scope.clicked = false;
    $scope.signin = {};
    $scope.sign = function () {
        $scope.clicked = true;
        if ($scope.loginForm.$invalid) {
            $scope.errorAlert("One of the fields are invalid, please fix it")
        } else {
            console.log($scope.signin);
            $scope.loginAccount($scope.signin).then(redirect).catch(onErr);
        }
    };

    $scope.register = {};
    // setInterval(function(){
    //     console.log($scope.signForm);
    // }, 500);
    $scope.reg = function () {
        $scope.clicked = true;
        if ($scope.signForm.$invalid) {
            $scope.errorAlert('Error', "One of the fields are invalid, please fix it")
        } else {
            $scope.createNewAccount($scope.register).then(
                function(resp){
                    $scope.errorAlert("Success", "Confirmation mail was sent to your huji mail, please confirm your account", function(){redirect(resp)})
                }
            ).catch(onErr)
        }
    };
    $scope.forgot = {};
    $scope.forget = function () {
        if ($scope.signForm.$invalid) {
            $scope.errorAlert("One of the fields are invalid, please fix it")
        } else {
            $scope.forgotMyPass($scope.forgot).then(redirect).catch(onErr)
        }
    };

    $scope.resetPass = function () {
        if ($scope.resetForm.$invalid) {
            $scope.errorAlert("One of the fields are invalid, please fix it")
        } else {
            $scope.resetApi($scope.forgot.username).then(function () {
                $scope.errorAlert("Success, please check your email please..");
                $scope.reseted = false;
                window.location.hash = 'login';
            }).catch(function (err) {
                console.log(err);
                $scope.errorAlert("Failed, check your username and try again...");
            })

        }
    }

    function redirect(resp) {
        window.location = '/';
    }

    function onErr(err) {
        console.log(err);
        $scope.errorAlert(err.data);
    }
}]);