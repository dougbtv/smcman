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
	var fs = require('fs');
	
	// Cheerio is cool, it's a jquery subset which can parse a DOM.
	var cheerio = require('cheerio');

	// Optionally, as BA supports doing this to your p/w
	var md5 = require('MD5');

	this.testPoll = function(callback) {

		// Get the file contents (later, the URL)
		fs.readFile("/home/doug/codebase/smcman/forward.txt", "utf8", function(err,html){

			// console.log("!trace the html: ",html);

			var $ = cheerio.load(html);

			var formtag = $('meta').each(function(idx,metatag){
				
				console.log("\n\n!trace show each metatag:",metatag);
				var url = metatag.attribs.content;
				url = url.replace(/^.+URL\=(.+)$/,'$1');
				console.log("!trace url: ",url);

				// Ok, now we can go to the poll options url.
				fs.readFile("/home/doug/codebase/smcman/poll.txt", "utf8", function(err,html){

					console.log("!trace the html: ",html);

					var $ = cheerio.load(html);


					// ----------------------------------------------------------

					var newpostform = $('.vbform');
					// console.log("!trace newpostform: ",newpostform);
					var url_submit = BASE_URL + newpostform['0'].attribs.action;
					console.log("!trace url to post for new post: ",url_submit);

					var formtag = $('.vbform').find('input');

					var count = formtag.length;

					// Initialize our form.
					var form = {

					};

					formtag.each(function(idx,inputtag){
						// console.log("\n\n!trace show each inputtag: %s :",inputtag.name,inputtag.attribs);

						// We collect default hidden & text fields.
						// Ok, now we just want select fields from this.
						switch(inputtag.attribs.type) {
							case "text":
							case "hidden":
								form[inputtag.attribs.name] = inputtag.attribs.value; 
								break;

							default:
								break;
						}

						// Continue after you hit the last element.
						if (!--count) {

								// fill out your form! submit it!
								// what you're looking for: 
								//  name: 'options[8]',

								// !bang i left off here.
								/*

								!trace show each inputtag: input : { type: 'text',
									  class: 'primary textbox',
									  id: 'opt8',
									  name: 'options[8]',
									  tabindex: '1',
									  value: '' }


								*/

						}

					});


					// -------------------------------------------------------


				});


			});

		});

	}

	this.baPost = function(message,callback) {

		var message = {
			subject: "You'll see a few of these [we're porting the bot] (please delete, mods)",
			body: "[IMG]http://speedmodeling.org/smcfiles/rh2_cart.png[/IMG]",
			number_options: 8,
		};

		var options = {
			method: 'GET',
    		uri: BASE_URL + 'newthread.php?do=newthread&f=22',
		};

		// We request the new post page.
		request(options, function(error, response, html){
			if(!error){

				// We use cheerio for dom parsing
				var $ = cheerio.load(html);
				var newpostform = $('.vbform');
				// console.log("!trace newpostform: ",newpostform);
				var url_submit = BASE_URL + newpostform['0'].attribs.action;
				console.log("!trace url to post for new post: ",url_submit);

				var formtag = $('.vbform').find('input');

				var count = formtag.length;

				// Initialize our form.
				var form = {

				};

				formtag.each(function(idx,inputtag){
					// console.log("\n\n!trace show each inputtag: %s :",inputtag.name,inputtag.attribs);

					// We collect default hidden & text fields.
					// Ok, now we just want select fields from this.
					switch(inputtag.attribs.type) {
						case "text":
						case "hidden":
							form[inputtag.attribs.name] = inputtag.attribs.value; 
							break;

						default:
							break;
					}

					// Continue after you hit the last element.
					if (!--count) {


						// Add our custom info about the SMC.
						form.subject = message.subject;
						form.message = message.body;
						form.postpoll = "yes";
						form.polloptions = message.number_options;

						// Set the rest of the properties of the form.
						console.log("!trace HERE'S THE NEW FORM: ",form);

						// Now we're going to want to post it.
						// This gets harier for testing, because now you'll actually make a new thread.
						// Let's see what happens, hahah. Just get to poll options.

						var postoptions = {
							method: 'POST',
				    		uri: url_submit,
				    		form: form,
						};

						request(postoptions, function(error, response, html){

							console.log("!trace the html: ",html);

							var $ = cheerio.load(html);

							var formtag = $('form').each(function(idx,el){
								console.log("\n\n!trace show each el: %s :",el);
							});

						});

					}

				});


				// console.log("!trace FORM FILTER: ",$('.vbform').find('input'));

			/*	$('input').filter(function(idx,el){

					var attribs = $(el)[0].attribs;

					console.log("\n\n!trace EACH EL: ",attribs);

				});
		*/
				
				/*
				for (i in newpostform['0'].children) {
					var child = newpostform['0'].children[i];
					console.log("!trace each child: ",child);
				}*/

			} else {
				console.log("ERROR: We couldn't get the page which has the post-new-thread form on it.");
			}
		});


		/*

		Example post:

		rh2
		[IMG]http://speedmodeling.org/smcfiles/rh2_cart.png[/IMG]
		Teh_Bucket
		[IMG]http://speedmodeling.org/smcfiles/Teh_Bucket_CLown%20CAR%21.png[/IMG]
		kngcalvn
		[IMG]http://speedmodeling.org/smcfiles/kngcalvn_tube_car.png[/IMG]

		*/

	}

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