smcFrontEnd.controller('smcController', ['$scope', '$location', '$http', '$timeout', '$interval', '$cookies', 'smcSocketService', function($scope,$location,$http,$timeout,$interval,$cookies,socketservice) {

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

	// Limits per page
	var MAX_PER_PAGE = 5;

	// Defaults
	
	// $scope.message = "quux";
	console.log("!trace smc controller reporting in:",moment().format('MMMM Do YYYY, h:mm:ss a'));

	// We'll wanna make a request, hum.
	socketservice.manuallyGetSMC();

	// The promises from our updating.
	var promise_clock;
	var promise_poll;

	// Here's our URL params.
	$scope.smc_pageon = $location.search().page;
	if (typeof $scope.smc_pageon == 'undefined') {
		// Set that it's the first page.
		$scope.smc_pageon = 1;
	}
	console.log("What's the page param? ",$scope.smc_pageon);

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

	$scope.getSMCPage = function(page) {

		// Ok, get those SMCs.
		console.log("Yoooooooooooooooo !trace I'm getting the smc page....");

		$http.post('/api/getSMCList', { page: page, limit: MAX_PER_PAGE })
			.success(function(data){

				// Alright, this is good.
				// Set which page we're on.
				$scope.smc_pageon = page;
				$scope.smc_list = data.smcs;
				$scope.smc_total = data.total;
				$scope.smc_totalpages = Math.ceil(data.total/MAX_PER_PAGE);

				console.log("!trace here's the list of smcs",$scope.smc_list);


			}.bind(this)).error(function(data){

				console.log("ERROR: Can't quite get a page worth of SMCs");

			}.bind(this));

	}

	// Make a call to get the page in the URL (or the default if it's not specified)....
	$scope.getSMCPage($scope.smc_pageon);



	$scope.joinOrLeaveSMC = function(joinit) {

		// Ok, now call up the API.
		$http.post('/api/joinOrLeaveSMC', { username: $cookies.username, session: $cookies.session, isjoining: joinit })
			.success(function(data){

				// awesome, we don't have to do anything, really, right?

			}.bind(this)).error(function(data){

				console.log("ERROR: Can't quite leave or join an SMC.");

			}.bind(this));

	}

	// Basically just stops the clock.
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
	});

	$scope.$on("smcUpdate",function(event,smcdata){

		console.log("!trace GOT SMC UPDATE INFO:",smcdata);
		if (smcdata.phase) {

			// It can't be ended, right?
			$scope.smc_ended = false;

			// Slice n' dice the data.
			$scope.setSMC(smcdata);

			// Figure out if the logged in user is in the SMC.
			if ($scope.login_status) {

				// Ok, see if their nick is in there.
				var foundem = false;
				for (var j = 0; j < smcdata.smcers.length; j++) {
					var smcer = smcdata.smcers[j];
					if (smcer.nick == $scope.username) {
						foundem = true;
						break;
					}
				}

				$scope.in_smc = foundem;

			} else {
				$scope.in_smc = false;
			}

			// Say it's in process if it wasn't before.
			if (!inprogress) {
				inprogress = true; 
				// Start the clock.
				$scope.smcClockUpdate();
			}

		} else {

			$scope.smc = false;

			// There's no SMC. So, if there WAS one, it's ended, somehow.
			if (inprogress) {
				$scope.stopSMC();
			}

		}

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

	// Poll immediately, and let it take care of further polling if need be.
	/*

	// DEPRECATED. DS

		promise_poll = $scope.pollSMC();

		
	*/

}]);