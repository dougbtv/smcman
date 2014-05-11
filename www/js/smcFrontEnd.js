// public/core.js
var smcFrontEnd = angular.module('smcFrontEnd', ['angularFileUpload']);

function smcMainController($scope, $location, $http, $upload) {

	// Defaults!
	$scope.formData = {};
	$scope.uploadMode = "init";

	// We want more in the path than JUST the page. So let's get that.
	// And for that we can pack the URL params into json with:
	// var searchObject = $location.search();
	// ...so awesome.
	// from: https://docs.angularjs.org/api/ng/service/$location
	
	// Stores which page we're currently, specifically on load (as this is the constructor)
	$scope.onPage = $location.path().substring(1) || 'home';

	// Sets the navigation's CSS class, depending on the onPage.
	$scope.navClass = function (page) {
		
		// Get the route.
		var currentRoute = $location.path().substring(1) || 'home';

		// Set the onPage if it's wrong.
		if (currentRoute != $scope.onPage) {
			$scope.onPage = currentRoute;
		}

		return page === currentRoute ? 'active' : '';
	};

	$scope.verifyUploadKey = function() {


		var params = $location.search();
		console.log("!trace verify key params: ",params);
		var uploadkey = params.key;
		console.log("!trace verify key itself: ",uploadkey);

		var invalid_request = true;

		if (typeof uploadkey != 'undefined') {

			// Only accept hex.
			if (uploadkey.match(/^[0-9a-fA-F]+$/)) {

				// Make the API request.
				$http.post('/api/verifyUploadKey', {key: uploadkey})
					.success(function(data) {
						console.log("!trace key request received data",data);
						// That's a good key, we can move along.
						if (data.success) {
							$scope.uploadMode = 'upload';
						} else {
							// Not a good upload key.
							$scope.setUploadError("Dude, sorry that key is no longer good (or may never have been.)");
						}
						
					})
					.error(function(data) {
						
						$scope.setUploadError(data);
						
					});

				invalid_request = false;
			}

		}

		// Give them the sorry / default page if there's no valid key request.
		if (invalid_request) {
			$scope.uploadMode = "sorry";
		}

	}

	$scope.setUploadError = function(err) {

		console.log('!upload error: ',err);
		$scope.uploadMode = 'upload-error';
		$scope.uploadError = err;

	}

	// Set which page we're on.
	$scope.switchPage = function (page,initial_load) {
		// Go ahead and create a handler here to do things when the page is changed.
		if ($scope.onPage != page || (typeof initial_load != 'undefined')) {

			// Most importantly, this switches the view angular style.
			$scope.onPage = page;

			// Now handle it.
			console.log("!trace switch page to: " + page);

			switch(page) {

				case "upload":
					
					// If someone is in the middle of a process... we don't wanna restart it.
					// !bang

					switch ($scope.uploadMode) {
						// During any of these modes, it's OK to restart.
						case "init":
						case "upload-success":
						case "upload-error":
							$scope.verifyUploadKey();
							break;

						default:
							break;

					}

					break;

			}


		}

	}

	// We also call this switch page when the page is first loaded.
	$scope.switchPage($scope.onPage,true);


	// --------------------------------<<<<<<<<<<<<<<<<<< end reference
	
	$scope.onFileSelect = function($files) {

		console.log("!trace GOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOD");

		$scope.uploadMode = "upload-in-progress";

		var params = $location.search();
		var uploadkey = params.key;

		//$files: an array of files selected, each file has name, size, and type.
		for (var i = 0; i < $files.length; i++) {
			var file = $files[i];
			$scope.upload = $upload.upload({
				url: '/api/upload', //upload.php script, node.js route, or servlet url

				// For other methods, or headers.
				// method: 'POST' or 'PUT',
				// headers: {'header-key': 'header-value'},
				// withCredentials: true,

				// To attach data.
				data: {key: uploadkey},
				file: file, // or list of files: $files for html5 only

				/* set the file formData name ('Content-Desposition'). Default is 'file' */
				//fileFormDataName: myFile, //or a list of names for multiple files (html5).
				/* customize how data is added to formData. See #40#issuecomment-28612000 for sample code */
				//formDataAppender: function(formData, key, val){}

			}).progress(function(evt) {

				$scope.upload_percent = parseInt(100.0 * evt.loaded / evt.total);
				console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));

			}).success(function(data, status, headers, config) {

				// file is uploaded successfully
				console.log("!trace upload success data: ",data);

				// It's a success!
				$scope.uploadMode = 'upload-success';

				$scope.uploadedURL = data.url;


			}).error(function(err) {

				$scope.setUploadError(err);

			});
		  //.then(success, error, progress); 
		  //.xhr(function(xhr){xhr.upload.addEventListener(...)})// access and attach any event listener to XMLHttpRequest.
		}
		/* alternative way of uploading, send the file binary with the file's content-type.
		   Could be used to upload files to CouchDB, imgur, etc... html5 FileReader is needed. 
		   It could also be used to monitor the progress of a normal http post/put request with large data*/
		// $scope.upload = $upload.http({...})  see 88#issuecomment-31366487 for sample code.
	  };


	// --------------------------------<<<<<<<<<<<<<<<<<< end reference

	// ---------------------- REFERENCE FUNCTION. !bang

	// Go ahead and compile the input.
	$scope.hitCompile = function() {

		console.log("!trace hit compile",$scope.formData);
		
		$http.post('/api/compile', $scope.formData)
			.success(function(data) {
				$scope.asm = data.asm;
				$scope.formData.output = data.asm_text;
				$scope.formData.hexcode = data.hexcode;
				console.log("!trace out data",data);
			})
			.error(function(data) {
				console.log('Error: ',data);
			});

	}

	// Sets the class of the asm output to represent traced items.
	// Check out contextual tables here: http://twitterbootstrap.org/twitter-bootstrap-table-example-tutorial/

	$scope.traceByRegex = function(index) {

		if (typeof $scope.formData.traceregex != 'undefined' && $scope.formData.traceregex.length) {
		
			var traceregexstring = '' + $scope.formData.traceregex + '';
			
			try {
				var re_trace = new RegExp(traceregexstring,'gi');
			} catch (e) {
				return "";
			}

			var eachasm = $scope.asm[index];
			
			if (eachasm.match(re_trace)) {
				return "info";
			} else {
				return "";
			}

		} else {
			return "";
		}
		


	}

	// scope sample

	$scope.sample = function() {

		var sample = 'sample here';

		$scope.formData.input = sample;

	}

}

/*
	function mainController($scope, $http) {
		$scope.formData = {};

		// when landing on the page, get all todos and show them
		$http.get('/api/foo')
			.success(function(data) {
				$scope.todos = data;
				// console.log(data);
			})
			.error(function(data) {
				console.log('Error: ' + data);
			});

		// when submitting the add form, send the text to the node API
		$scope.createTodo = function() {
			$http.post('/api/todos', $scope.formData)
				.success(function(data) {
					$scope.formData = {}; // clear the form so our user is ready to enter another
					$scope.todos = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ',data);
				});
		};

		// delete a todo after checking it
		$scope.deleteTodo = function(id) {
			$http.delete('/api/todos/' + id)
				.success(function(data) {
					$scope.todos = data;
					console.log(data);
				})
				.error(function(data) {
					console.log('Error: ' + data);
				});
		};

	}
*/




$(document).ready(function(){
	$("[data-toggle=tooltip]").tooltip({ placement: 'right'});
});




// --------------- shortcut functions
// http://zachsnow.com/#!/blog/2013/angularjs-shortcuts/
