smcFrontEnd.controller('filesController', ['$scope', '$location', '$http', '$cookies', 'smcSocketService', function($scope,$location,$http,$cookies,socketservice) {

	// Our default label (e.g. when none is selected)
	var DEFAULT_LABEL = "{All Labels}";

	// Figure out what page we're on.
	$scope.files_pageon = $location.search().page;
	if (typeof $scope.files_pageon == 'undefined') {
		// Set that it's the first page.
		$scope.files_pageon = 1;
	}

	// Maximums for pagination.
	$scope.MAX_PER_PAGE = 15;
	$scope.MAX_PAGES = 5;

	// Default the actual list we use.
	$scope.files_list = false;
	$scope.files_baseurl = "#/files";

	// Constructor at the bottom, so I can define the methods....

	// Set the label to filter by.
	$scope.setLabel = function() {

		// Hey, we can get the files given this guy.
		$scope.getFileList();

	}

	$scope.getFileList = function() {

		var label = $scope.filterlabel;
		var nick = $scope.filesuser;

		// Change the label if it's the default.
		// ...We'll just clear it.
		if (label == DEFAULT_LABEL) {
			label = false;
		}

		// Now let's make that ajax call.
		$http.post('/api/listFiles', { nick: nick, label: label, page: $scope.files_pageon, limit: $scope.MAX_PER_PAGE })
			.success(function(data){

				console.log("!trace file RAW: ",data);

				// Set the total for the paginator.
				$scope.files_datatotal = data.total;

				// We'll groom the uploads to do some nice things for display.
				var uploads = data.uploads;

				for (var i = 0; i < uploads.length; i++) {
					// Go ahead and do a few things:
					// 1. Set a pretty date.
					// 2. Set if is an image.

					uploads[i].is_image = $scope.isImage(uploads[i].mime_type);

				}

				// Now, go and set the file list scope item.
				$scope.files_list = uploads;

				console.log("!trace file list: ",uploads);


			}.bind(this)).error(function(data){

				// Log an error with our API request.
				console.log("ERROR: Dangit, screwed up when I went to get a list of files.");

			}.bind(this));

	}

	$scope.isImage = function(mimetype) {

		if (typeof mimetype == 'undefined') {
			return false;
		}

		if (mimetype.match(/(image|jpg|jpeg|png|tga|bmp|svg|gif)/)) {
			return true;
		} else {
			return false;
		}

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

		// Hook that onto our baseurl.
		$scope.files_baseurl += "?user=" + $scope.filesuser;

		// And also get the default page for 'em.
		$scope.getFileList();

	} else {
		// Set that it's the search page, this is the default way you come into the page.
		$scope.filesuser = false;
	}

}]);