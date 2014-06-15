smcFrontEnd.controller('filesController', ['$scope', '$location', '$http', '$cookies', 'smcSocketService', function($scope,$location,$http,$cookies,socketservice) {

	var DEFAULT_LABEL = "{All Labels}";

	// Constructor at the bottom, so I can define the methods....

	// Set the label to filter by.
	$scope.setLabel = function() {

		// Hey, we can get the files given this guy.
		$scope.getFiles();

	}

	$scope.getFiles = function(nick,label) {

		

	}

	// List files for a particular user.
	$scope.getLabelsForUser = function() {

		$http.post('/api/getLabels', { nick: $scope.filesuser })
			.success(function(data){

				// Add the default at the beginning.
				data.unshift({label: DEFAULT_LABEL});
	
				$scope.labellist = data;

				console.log("!trace label list: ",data);


			}.bind(this)).error(function(data){

				// Log an error with our API request.
				console.log("ERROR: Fudge, unable to get list of labels for user.");

			}.bind(this));


	}


	// Search by nick, to get a list of nicks.

	$scope.searchByNick = function() {

		// Ok, send this only if there's 
		if ($scope.searchnick.length > 2) {

			$http.post('/api/searchForFilesNick', { nick: $scope.searchnick })
				.success(function(data){

					// Cool, see if there's anything there.
					
					if (data.nicks.length > 0) {

						// Send the list to the UI.
						$scope.search_result = data.nicks;
						
						// cool, that's good.
						$scope.search_status = "results";

					} else {

						// Show that we have no results.
						$scope.search_status = "noresults";

					}

				}.bind(this)).error(function(data){

					// Log an error with our API request.
					console.log("ERROR: Sooo, had trouble submitting that vote. sucks.");

				}.bind(this));

		} else {

			// Let 'em know they need to use 3 or more characters.
			$scope.search_status = "tooshort";
		}

	}

	$scope.filterlabel = DEFAULT_LABEL;

	// Constructor type actions....
	$scope.search_status = "emptysearch";

	// Here's our URL params.
	$scope.filesuser = $location.search().user;
	if (typeof $scope.filesuser != 'undefined') {

		// So that's great, there's a username there.
		// Let's start the request to pull up the user's files.
		$scope.getLabelsForUser();

	} else {
		// Set that it's the search page, this is the default way you come into the page.
		$scope.filesuser = false;
	}

}]);