angular.module("welcome")
  .directive('register', function(Communicator) {
    
    function hide($el) {
      $el.animate({
        height: 0,
        margin:0
      });
    }

    function show($el) {
      $el.animate({
        height: 340
      }); 
    }

    return {
      restrict: 'E',
      replace: true,
      scope: {
        //user: '=',
        onRegister: '&'
      },

      template: 
        '<form name="registrationForm" class="registration" novalidate="novalidate">' +
          '<div class="wrapper" style="height:0">' +
            '<div class="form-group">' +
              '<input name="password" type="password" class="form-control" placeholder="Password longer then 5 characters"' +
                'ng-required="true" ng-minlength="5" ng-maxlength="100" ng-model="user.password"/>' +
            '</div>' +
            '<div class="form-group">' +
              '<input name="confirm" type="password" class="form-control" placeholder="Confirm Password"' +
                'ng-disabled="!validPassword()" ng-required="true" ng-change="passwordMatch(user.password, user.confirm)" ng-model="user.confirm"/>' +
            '</div>' +
            '<div class="form-group">' +
              '<input name="firstname" type="text" class="form-control" placeholder="First Name"' +
                'ng-required="true" ng-model="user.firstname"/>' +
            '</div>' +
            '<div class="form-group">' +
              '<input name="firstname" type="text" class="form-control" placeholder="Last Name"' +
                'ng-required="true" ng-model="user.lastname"/>' +
            '</div>' +
            '<div class="form-group">' +
              '<input name="email" type="email" class="form-control" placeholder="Email"' +
                'ng-required="true" ng-model="user.email"/>' +
            '</div>' +
            '<div class="form-group">' +
              '<button ng-click="reset()" class="btn btn-large btn-link">Cancel</button>' +
              '<button ng-click="register(user)" class="btn btn-large btn-info" ng-disabled="registrationForm.$invalid">Register</button>' +
            '</div>' +
          '</div>' +
        '</form>',


      controller: function($scope, $element) {

        $scope.$on(Communicator.CHANNEL, function() {
          var view = Communicator.packet,
              $jEl = $($element.children()[0]);

          if(view === 'register') {
            show($jEl); 
          }
          else {
            hide($jEl); 
          }
        });

        var blankUser = {
          password:'',
          firstname: '',
          lastname: '',
          email: ''
        };
        $scope.register = function(user) {
          var promise = $scope.onRegister({user: user});

          if(promise['success'] && promise['error']) {
            promise
              .success(function(data, status, headers, config) {
                $scope.reset();
              })
              .error(function(data, status, headers, config) {
                // error occured server side
              }); 
          }
          else {
            console.log('Register: promise was not returned by callback');
          }
          
        }

        $scope.passwordMatch = function(password, confirm) {
          if(password === confirm) {
            //set confirm class to success
            $scope.registrationForm.confirm.$setValidity('passwords match', true);
          }
          else {
            //set confirm class to error
            $scope.registrationForm.confirm.$setValidity('passwords match', false);
          }
        };

        $scope.validPassword = function() {
          if($scope.registrationForm.password.$valid) {
            return true;
          }
          else {
            $scope.confirm = '';
            $scope.registrationForm.confirm.$setPristine();
          }
        };

        $scope.reset = function() {
          $scope.user = angular.copy(blankUser);  
          $scope.confirm = $scope.user.password;
          this.registrationForm.$setPristine();
        };

        $scope.valid = function(controleField) {
          var control = this.registrationForm[controleField];

          if(control) {
            return control.$valid;
          }
        };
      }
    };  
  });