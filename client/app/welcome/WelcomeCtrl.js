angular.module("welcome")
	.controller("WelcomeCtrl", function($scope, $http, $window, $timeout) {

		var self = this;

		$scope.welcome = {
			views: ["Login", "Register"],
			selected: "Login"
		};

		self.toggleView = function() {
			$scope.tv.toggle = !$scope.tv.toggle;
			$scope.$apply();
		}

		$scope.alert = {
			list: [],
			new: function(alert) {
				var index = $scope.alert.list.push(alert);
				return index - 1;
			},
			remove: function(index) {
				$scope.alert.list.splice(index);
			}
		};

		$scope.login = function(email, password) {

			$http.post('/login', {email: email, password: password})
				.success(function(data, status, headers, config) {
					console.log('login success', arguments);

					if(data.redirect) {
						$window.location = data.redirect;
					}
				})
				.error(function(data, status, header, config) {
					console.log('login error', arguments);

					if(data.redirect) {
						//send alert "invalid credentials"
						if(status === 500) {
							alert("server error");	
						}
						else {
							alert("invalid credentials")
						}
					}
				});
		};

		$scope.register = function(user) {

			return $http.post('/register', user)
				.success(function(data, status, headers, config) {
					if(data.redirect) {
						var index = $scope.alert.new({
							type: 'success',
							msg: 'You have successfully registered'
						});

						$timeout(function() {
							$scope.alert.remove(index);
						}, 2000)

					}
					
					self.toggleView();
				})
				.error(function(data, status, header, config) {
					console.log('register error', arguments);

					$scope.alert.new({
						type: 'error',
						msg: 'There was a problem registering'
					});
				});
		};
	});

