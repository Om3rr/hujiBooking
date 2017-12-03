app.controller('loginCtrl', ['$scope', function ($scope) {
    $scope.signin = {};
    $scope.sign = function(){
        if($scope.loginForm.$invalid){
            alert("One of the fields are invalid, please fix it")
        } else {
            console.log($scope.signin);
            $scope.loginAccount($scope.signin).then(redirect).catch(onErr);
        }
    };

    $scope.register = {};
    setInterval(function(){
        console.log($scope.signForm);
    }, 500);
    $scope.reg = function(){
        if($scope.signForm.$invalid){
            alert("One of the fields are invalid, please fix it")
        } else {
            $scope.createNewAccount($scope.register).then(redirect).catch(onErr)
        }
    };

    function redirect(resp){
        window.location = '/';
    }
    function onErr(err){
        console.log(err);
        alert(err.data);
    }
}]);