// ----------------------------------------------- -
// -- The Blender Artists Scraper
// ----------------------------------------------- -
// Thanks again scotch.io:
// http://scotch.io/tutorials/javascript/scraping-the-web-with-node-js

module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {

	var BASE_URL = 'http://blenderartists.org/forum/';


	// Setup our request & cookie jar.
	var request = require('request');
	var cookiejar = request.jar();
	var request = request.defaults({jar:cookiejar});
	
	// Cheerio is cool, it's a jquery subset which can parse a DOM.
	var cheerio = require('cheerio');

	// Optionally, as BA supports doing this to your p/w
	var md5 = require('MD5');

	// Login to blender artists
	this.baLogin = function(callback) {

		// Here's our base options for the main page.
		var options = {
			method: 'GET',
    		uri: BASE_URL + 'index.php'
		};

		// Request that main page.
		request(options, function(error, response, html){
			if(!error){

					// console.log("first response: %s \n\n",response);
					// console.log("jar: %j",cookiejar);

					var rio = cheerio.load(html);

					// console.log("Initial page result doc: %j",);

					var loginform = rio('#navbar_loginform');
					var url_submit = BASE_URL + loginform['0'].attribs.action;
					
					
					// Fill out the form for BA login.
					
					var filled_form = {
						vb_login_username: privates.BLENDERARTISTS_USERNAME,
						vb_login_password: privates.BLENDERARTISTS_PASSWORD,
						vb_login_password_hint: "Password",
						s: '',
						do: "login",
			    		securitytoken: "guest",
			    		// This also worked, but, you should set the above password field to blank.
			    		// vb_login_md5password: md5(privates.BLENDERARTISTS_PASSWORD),
			    		// vb_login_md5password_utf: md5(privates.BLENDERARTISTS_PASSWORD),
					};

					// console.log("filled form: %j", filled_form);
					// console.log("url_submit: ",url_submit);

					// Setup the request options for logging in.
					var loginform_options = {
						method: "POST",
						uri: url_submit,
						form: filled_form,
					};

					request(loginform_options,function(error, response, html){

						if(!error){

							/*
								// Sometimes... ya gotta debug.
								console.log("--------------------------------------- ");
								console.log(" html: ",html);
								console.log("--------------------------------------- ");
								console.log(" response: ",response.headers);
								console.log("--------------------------------------- ");
								console.log(" req: ",response.req._header	);
								console.log("--------------------------------------- ");
							*/


							// var rio = cheerio.load(html);

							// console.log("result: %j",json);
							// console.log("jar: %j",cookiejar);

							callback(true);



						} else {
							console.log("ERROR: Couldn't POST to BA login page");
							callback(false);
						}

					});
			
			} else {
				console.log("ERROR: Couldn't get initial BA page.");
				callback(false);
			}

		});
	

	}

}