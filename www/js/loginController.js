// --------------------------------------
// ------ The login module.
// Setup as a factory / service.
// As it's used between controllers.
// --------------------------------------

function loginModule($http,$cookies) {

	this.loggedin = false;

	this.foo = function() {
		console.log("!trace loggedin? ",this.loggedin);
	}

	this.submitAttempt = function(loginform,callback) {

		$http.post('/api/login', loginform)	
			.success(function(data) {
				
				// Ok.... callback with the result.
				console.log("!trace LOGIN AJAX: ",data);

				if (data.session) {
					// Ok, that's good, we can set what we need here.
					// Firstly, we'll set that we're logged in.
					this.loggedin = true;
					this.foo();
					// Now set our session cookie.
					$cookies.session = data.session;

					console.log("!trace SESSION ID: ",$cookies.session);

					callback(true);

				} else {
					callback(false);
				}
			}.bind(this))
			.error(function(data) {
			
				// Couldn't reach the api, seems.
				callback(false);	

			}.bind(this));	

	}

}

smcFrontEnd.factory('loginModule', ["$http", "$cookies", function($http,$cookies) {
	return new loginModule($http,$cookies);
}]);

smcFrontEnd.controller('loginController', ['$scope', '$location', '$http', 'loginModule', function($scope,$location,$http,login) {

	// $scope.message = "quux";
	console.log("!trace login controller instantiated.");

	$scope.clickLogin = function() {

		console.log("!trace click login data: ",$scope.loginForm);

		login.submitAttempt($scope.loginForm,function(sessionid){

			if (sessionid) {
				// Reset any previous errors.
				$scope.loginfailure = false;

			} else {
				// Welp. That's a failure.
				$scope.loginfailure = true;
			}

		});


	}


}]);


