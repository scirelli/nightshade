angular.module("welcome")
	.directive('toggleview', function(Communicator) {
		return {
			restrict: 'E',
			replace: true,
			scope: {
				onToggle: '&', 	// callback
				views: '=', 		// binding
				selected: '=',	// binding
				switch: '='
			},

			template: 
				'<div>' +
					'<label class="switch toggle toggle-switch well">' +
						
						'<input type="checkbox" ng-model="tv.toggle">' +
						'<span class="toggle-wrapper">' +
							'<span class="toggle-label" ng-repeat="view in views">{{view}}</span>' +
						'</span>' +
						
						'<a class="slide-button btn btn-default"></a>' +
					'</label>' + 
				'</div>',



			controller: function($scope, $element) {
				$scope.$watch('tv.toggle', function(newVal, oldVal) {
					var index = +newVal;

					if($scope.views[index]){
						Communicator.send(angular.lowercase($scope.views[index]));
					}
				});

				$scope.$watch('switch', function(newVal) {
					$scope.tv.toggle = newVal;
				});

				var isChecked = +$scope.views.indexOf($scope.selected);
				isChecked = (isChecked ? true : false);

				$($element)
					.find('input')
					.prop('checked', isChecked)

				$scope.tv = {
				 	toggle: isChecked
				}
			},

			link: function(scope, element, attributes) {
				scope.toggle = function(view) {
					scope.onToggle({view: view});
				};

			}
		};
	});