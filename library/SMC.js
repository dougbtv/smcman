module.exports = function(bot, chat, mongoose, db, constants, privates) {

	var is_running = false;	// Is the SMC active?
	var topic;				// What's the topic?
	var startsat;			// When does it start.
	var originator;			// Who's the originator? (who started it.)


	this.startSMC = function(command,from) {

		console.log("!trace command: ",command);

		// Check for a properly formatted argument format.
		if (command.args.match(/\".+\"\s\d\d\s\d\d/)) {

			// Setup our SMC properties.
			originator = from;
			topic = command.arglist[0];
			startsat = command.arglist[1];
			length = command.arglist[2];

			console.log("!trace that's good");

			if (!is_running) {

				chat.say("smc_started",[from,topic,startsat,length]);
				is_running = true;

			} else {

				chat.say("smc_already_in_progress",[]);

			}

		} else {

			chat.say("smc_command_error",[]);

		}

	}

	this.cancelSMC = function(command,from) {

		if () {}


	}

	this.joinSMC = function(command) {

	}

}