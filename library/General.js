module.exports = function(smcman, bot, chat, mongoose, db, constants, privates) {
	
	this.google = function(command,from) {
		var google = require('google');
		
		google.resultsPerPage = 5;
	//	var nextCounter = 0;
		
		google(command.args, function(err, next, links) {
		 if (err) console.error(err);
		 
	//	console.log("Google: ", links[0].title + ' :: ' + links[0].link);
		chat.say("google", [command.args, links[0].link]);
		
		});
	}

};