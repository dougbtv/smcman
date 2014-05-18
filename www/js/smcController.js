smcFrontEnd.controller('smcController', ['$scope', '$location', '$http', '$timeout', 'loginModule', function($scope,$location,$http,$timeout,login) {

	// Timeout intervals.

	var HOT_POLL_INTERVAL = 5000; 	// Every 5 seconds.
	var COLD_POLL_INTERVAL = 15000; // Every 15 seconds.

	// Defaults
	
	// $scope.message = "quux";
	console.log("!trace smc controller reporting in:",moment().format('MMMM Do YYYY, h:mm:ss a'));

	$scope.pollSMC = function() {

		// Ok, the first thing we really need to do is ask the API if we have an SMC going.
		$http.post('/api/livesmc', {})	
			.success(function(smcdata) {
				
				console.log("!trace GOT SMC INFO:",smcdata);
				if (smcdata.phase) {
					// We do indeed have an SMC.
					// So we'll go and set what we need.
					$scope.smc = smcdata;
					$scope.dudes = smcdata.smcers;
					$scope.test = ['one','two','three'];

					// And we'll schedule it again.
					$timeout($scope.pollSMC,HOT_POLL_INTERVAL);
				}
			
			})
			.error(function(smcdata) {

				console.log("ERROR: Ooops. Couldn't get the smc info via API");

			});

	}

	// Poll immediately, and let it take care of further polling if need be.
	$scope.pollSMC();

	$scope.setSMC = function(smc) {

		// Ok, now we can set our scopes as we need.



	}

}]);