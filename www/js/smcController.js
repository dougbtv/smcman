smcFrontEnd.controller('smcController', ['$scope', '$location', '$http', '$timeout', '$interval', 'loginModule', function($scope,$location,$http,$timeout,$interval,login) {

	// SMC in progress? 
	var inprogress = false;

	// Timeout intervals.
	var HOT_POLL_INTERVAL = 5000; 	// Every 5 seconds.
	var COLD_POLL_INTERVAL = 15000; // Every 15 seconds.

	// Our static phases.
	var PHASE_INTIALIZED = 1;
	var PHASE_RUNNING = 2;
	var PHASE_UPLOAD = 3;
	var PHASE_RENDER = 4;

	// Defaults
	
	// $scope.message = "quux";
	console.log("!trace smc controller reporting in:",moment().format('MMMM Do YYYY, h:mm:ss a'));

	// The promises from our updating.
	var promise_clock;
	var promise_poll;

	$scope.smcClockUpdate = function() {

		if (inprogress) {

			// Don't start a new clock timer if we are already smc'ing
			if ( angular.isDefined(promise_clock) ) return;

			promise_clock = $interval(function() {
				if (inprogress) {
					
					// We need to know what it is right now.
					var nowmoment = new moment();

					// Switch based on the phase.
					switch ($scope.smc.phase) {
						case PHASE_INTIALIZED:
							// We want when it starts.
							var endmoment = new moment($scope.smc.startsat);		
							break;
						case PHASE_RUNNING:
						case PHASE_UPLOAD:
							// We want when it ends.
							var endmoment = new moment($scope.smc.endsat);		
							break;
						case PHASE_RENDER:
							// We want when you have to render by.
							var endmoment = new moment($scope.smc.uploadby);
							break;
					}

					// Do the math.
					var seconds_left = endmoment.diff(nowmoment, 'seconds');
					var difference = moment.duration(seconds_left,'seconds');

					// If the difference is close or zero, we poll specially for this.
					if (seconds_left == 0) {
						$timeout.cancel(promise_poll);
						$scope.pollSMC();
					}

					// console.log("!trace duraction: ",difference);

					// Now we know what's left on the clock.
					$scope.clock_hours = "";
					if (difference.hours()) {
						$scope.clock_hours = ("00" + (difference.hours()).toString()).slice(-2) + " : ";
					}
					$scope.clock_minutes = ("00" + (difference.minutes()).toString()).slice(-2);
					$scope.clock_seconds = ("00" + (difference.seconds()).toString()).slice(-2);

				} else {
					$scope.stopSMC();
				}
		
			}, 1000);

		}

	};

	$scope.stopSMC = function() {
		if (inprogress) {
			inprogress = false;
			$scope.smc_ended = true;
		}

		if (angular.isDefined(promise_clock)) {
			$interval.cancel(promise_clock);
			promise_clock = undefined;
		}
	};

	$scope.$on('$destroy', function() {
	  // Make sure that the interval is destroyed too
	  $scope.stopSMC();
	  // And also the polling.
	  $timeout.cancel(promise_poll);

	});

	$scope.pollSMC = function() {

		// Ok, the first thing we really need to do is ask the API if we have an SMC going.
		$http.post('/api/livesmc', {})	
			.success(function(smcdata) {
				
				console.log("!trace GOT SMC INFO:",smcdata);
				if (smcdata.phase) {

					// It can't be ended, right?
					$scope.smc_ended = false;

					// Slice n' dice the data.
					$scope.setSMC(smcdata);

					// Say it's in process if it wasn't before.
					if (!inprogress) {
						inprogress = true; 
						// Start the clock.
						$scope.smcClockUpdate();
					}

					// And we'll schedule it again.
					promise_poll = $timeout($scope.pollSMC,HOT_POLL_INTERVAL);
				
				} else {

					$scope.smc = false;

					// There's no SMC. So, if there WAS one, it's ended, somehow.
					if (inprogress) {
						$scope.stopSMC();
					}

					// And we'll schedule it again.
					promise_poll = $timeout($scope.pollSMC,COLD_POLL_INTERVAL);

				}
			
			})
			.error(function(smcdata) {

				console.log("ERROR: Ooops. Couldn't get the smc info via API");

				// And we'll schedule it again.
				promise_poll = $timeout($scope.pollSMC,COLD_POLL_INTERVAL);

			});

	}

	// Poll immediately, and let it take care of further polling if need be.
	promise_poll = $scope.pollSMC();

	$scope.setSMC = function(smc) {

		// Ok, now we can set our scopes as we need.
		// We do indeed have an SMC.
		// So we'll go and set what we need.
		$scope.smc = smc;

		// Get the minute of the starting time.
		var startmoment = new moment(smc.startsat);
		var startmin = startmoment.minute().toString();
		// Left pad it.
		var startmin = ("00" + startmin).slice(-2);
		$scope.smc.startminute = startmin;

		// Set the clock test based on phase.
		switch (smc.phase) {
			case PHASE_INTIALIZED:
				$scope.time_message = "Starts in:";
				break;
			case PHASE_RUNNING:
			case PHASE_UPLOAD:
				$scope.time_message = "Ends in:";
				break;
			case PHASE_RENDER:
				$scope.time_message = "Upload in:";
				break;
			
		}

	}

}]);