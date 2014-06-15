smcFrontEnd.controller('filesController', ['$scope', '$location', '$http', '$cookies', 'smcSocketService', function($scope,$location,$http,$cookies,socketservice) {

	console.log("!trace YO, IT'S THE FILES CONTROLLER.");

	$scope.search_status = "emptysearch";

	// Here's our URL params.
	$scope.filesuser = $location.search().user;
	if (typeof $scope.filesuser == 'undefined') {
		// Set that it's the search page.
		$scope.filesuser = false;
	}

	$scope.searchByNick = function() {

		console.log("Search nick: ",$scope.searchnick);

		// Ok, send this only if there's 
		if ($scope.searchnick.length > 2) {

			$http.post('/api/searchForFilesNick', { nick: $scope.searchnick })
				.success(function(data){

					// Cool, see if there's anything there.
					
					if (data.nicks.length > 0) {

						$scope.search_result = data.nicks;
						console.log("!trace foo check", $scope.search_result);

						// cool, that's good.
						$scope.search_status = "results";

					} else {

						$scope.search_status = "noresults";

					}

				}.bind(this)).error(function(data){

					console.log("ERROR: Sooo, had trouble submitting that vote. sucks.");

				}.bind(this));


		} else {
			$scope.search_status = "tooshort";
		}

	}

}]);