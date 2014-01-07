angular.module("welcome")
	.directive('toggleview', function(Communicator) {
		return {
			restrict: 'E',
			replace: true,
			controller: 'WelcomeCtrl',

			template: 
				'<div>' +
					'<label class="switch toggle toggle-switch well">' +
						
						'<input type="checkbox" ng-model="tv.toggle">' +
						'<span class="toggle-wrapper">' +
							'<span class="toggle-label" ng-repeat="view in welcome.views">{{view}}</span>' +
						'</span>' +
						
						'<a class="slide-button btn btn-default"></a>' +
					'</label>' + 
				'</div>',

			link: function($scope, $element, $attrs, WelcomeCtrl) {
				
				var isChecked = +$scope.welcome.views.indexOf($scope.welcome.selected);
				isChecked = (isChecked ? true : false);

				$($element)
					.find('input')
					.prop('checked', isChecked)

				$scope.tv = {
				 	toggle: isChecked
				}

				$scope.$watch('tv.toggle', function(newVal, oldVal) {
					var index = +newVal;

					if($scope.welcome.views[index]){
						Communicator.send(angular.lowercase($scope.welcome.views[index]));
					}
				});
			}
		};
	});