// --------------------------------------
// ------ The login module.
// Setup as a factory / service.
// As it's used between controllers.
// --------------------------------------

function loginModule($http) {

	this.cheese = "cheddar";

	this.foo = function() {
		console.log("!trace cheese: " + this.cheese);

		$http.post('/api/verifyUploadKey', {key: "123"})

		.success(function(data) {
			// That's a good key, we can move along.
			console.log("!trace ajaxit: ",data);
			
		})
		.error(function(data) {
		
						

		});

	}

}

smcFrontEnd.factory('loginModule', ["$http", function($http) {
	return new loginModule($http);
}]);

smcFrontEnd.controller('loginController', ['$scope', '$location', '$http', 'loginModule', function($scope,$location,$http,login) {

	// try that.
	login.foo();

	// $scope.message = "quux";
	console.log("!trace login controller instantiated.");


}]);


