angular.module('welcome')
	.directive('login', function(Communicator) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				onLogin: '&' //login callback	
			},

			template: 
				'<form name="loginForm" novalidate>' +
					'<div class="wrapper" style="height: 0">' +
						'<div class="form-group">' +
						  '<input name="email" class="form-control" type="text" placeholder="Enter Username e.g. Email Address"' +
						  				'ng-model="login.email" ng-maxlength="100" />' +
						'</div>' +
						'<div class="form-group">' + 
						  '<input name="password" class="form-control" type="password" placeholder="Enter Password"' +
						  				'ng-model="login.password" ng-maxlength="100" />' +
						'</div>' +

						'<div class="form-group">' +
							'<button class="btn btn-large btn-block btn-info" ng-click="login(login.password, login.email)">Login</button>' +
						'</div>' +
					'</div>' +
				'</form>',

			controller: function($scope, $element) {
				$scope.$on(Communicator.CHANNEL, function() {
					var view = Communicator.packet,
							$jEl = $($element.children()[0]);

					if(view === 'login') {
						$jEl.animate({
							height: 150
						});
					}
					else {
						$jEl.animate({
							height: 0,
							margin:0
						});
					}
				});
			},

			link: function(scope) {
				scope.login = function(email, password) {
					console.log(scope.login.email, scope.login.password);
					scope.onLogin({email: scope.login.email, password: scope.login.password});
				}
			}
		};
	});