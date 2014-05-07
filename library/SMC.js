module.exports = function(bot, chat, mongoose, db, constants, privates) {

	var is_running = false;	// Is the SMC active?
	var topic;				// What's the topic?
	var startsat;			// When does it start.
	var originator;			// Who's the originator? (who started it.)


	this.startSMC = function(command,from) {

		console.log("!trace command: ",command);

		// Check for a properly formatted argument format.
		if (command.args.match(/['"].+['"]\s\d\d\s\d\d/)) {

			// Setup our SMC properties.
			originator = from;
			topic = command.arglist[0];
			topic = topic.replace(/['"]/g,"");
			startsat = command.arglist[1];
			length = command.arglist[2];

			console.log("!trace that's good");

			if (!is_running) {

				chat.say("smcstart",[topic,length,startsat]);
				is_running = true;

			} else {

				if (originator == from) {

					chat.say("smc_alreadystarted_by_owner",[from]);

				} else {

					chat.say("smc_already_in_progress",[]);

				}

			}

		} else {

			chat.say("smc_command_error",[]);

		}

	}

	this.tearDownSMC = function() {

		is_running = false;

	}

	this.cancelSMC = function(command,from) {

		if (is_running) {

			if (originator == from) {

				chat.say("smc_cancel",[from]);
				this.tearDownSMC();

			} else {

				// We should check if they're an admin.
				// If they're not, they're not allowed.
				bot.say("nickserv", "info " + from);

				chat.say("smc_cancel_notallowed",[from]);

			}

		} else {

			chat.say("smc_no_cancel",[from]);

		}
		
	}

	this.joinSMC = function(command) {

	}

}