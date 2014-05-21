module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {
	
	this.googlesearch = function(command,from) {
		var google = require('google');
		
		// Max Number of results we will scrap from, this could be higher,
		// but we should only need 5 results and choose a random one to display
		google.resultsPerPage = 5;
		
		// Also to note, we could dynamically set this based on google.resultsPerPage
		// but for #smc, you wont need any higher
		var i = Math.floor(Math.random()*4);
		
		google(command.args, function(err, next, links) {
			if (err) console.error(err);
			// This is for Debugging!	 
			/*	console.log("Google Result: ", links[i].title + ' :: ' + links[i].link);
				console.log("Rand Number: ", i); */
		
		// NOTE: Some results -will- come up with a null link and so we count that as
		// no results to show, this isn't a flaw in the code, so much as the module is only
		// scrapping the results page, Its not a huge issue, since this isnt a api module	
			if(!links[i].link) {
				chat.say("google_no_results", [from, command.args]);
			} else {
				chat.say("google", [command.args, links[i].link]);
			}
		});
	}

};