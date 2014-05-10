// public/core.js
var smcFrontEnd = angular.module('smcFrontEnd', []);

function smcMainController($scope, $location, $http) {

	// Defaults!
	$scope.formData = {};
	$scope.uploadMode = "loading";

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
	    		console.log("!trace GOOD GOT IT ALL HEX.");

	    		// Make the API request.
	    		$http.post('/api/verifyUploadKey', {key: uploadkey})
					.success(function(data) {
						console.log("!trace key request received data",data);
					})
					.error(function(data) {
						console.log('Error: ',data);
					});

	    		invalid_request = false;
	    	}

	    }

	    // Give them the sorry / default page if there's no valid key request.
	    if (invalid_request) {
	    	$scope.uploadMode = "sorry";
	    }

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
  	    			// The thing we really want to do is verify the upload key.
  	    			$scope.verifyUploadKey();
  	    			break;



  	    	}


    	}

    }

    // We also call this switch page when the page is first loaded.
    $scope.switchPage($scope.onPage,true);

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
